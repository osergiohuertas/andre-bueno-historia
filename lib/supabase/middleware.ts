import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

const ROTAS_CONTA_PUBLICAS = ["/conta/cadastro", "/conta/entrar"];
// Link de convite chega sem sessão nenhuma — é essa rota que troca o
// código do e-mail por uma sessão de verdade (ver
// app/painel/convite/aceitar/route.ts), por isso não pode exigir login
// antes de rodar.
const ROTA_ACEITAR_CONVITE = "/painel/convite/aceitar";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const emPainel = pathname.startsWith("/painel");
  const emLoginPainel = pathname === "/painel/login";
  const emAceitarConvite = pathname === ROTA_ACEITAR_CONVITE;
  const emConta = pathname.startsWith("/conta");
  const emContaPublica = ROTAS_CONTA_PUBLICAS.includes(pathname);

  // Supabase não configurado ainda (sem projeto provisionado): trata como
  // "sem sessão" em vez de quebrar a rota inteira. /painel/login e
  // /conta/entrar mostram a mensagem explicando o que falta.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    if (emPainel && !emLoginPainel && !emAceitarConvite) {
      const url = request.nextUrl.clone();
      url.pathname = "/painel/login";
      return NextResponse.redirect(url);
    }
    if (emConta && !emContaPublica) {
      const url = request.nextUrl.clone();
      url.pathname = "/conta/entrar";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Um usuário é "leitor" se, e só se, tiver linha em `membros` — o André
  // (conta única de operador) nunca tem. É essa checagem que impede um
  // leitor autenticado de entrar em /painel, e vice-versa.
  let ehLeitor = false;
  // "Colaborador" é um terceiro papel — autenticado, não-leitor, mas com
  // linha em `colaboradores`: só pode publicar/editar os próprios
  // artigos, nunca o resto do painel. Ver lib/painel-auth.ts (mesma
  // checagem, usada dentro de layouts/actions) e a rota permitida abaixo
  // — não confundir com "leitor", que fica em `/conta`, não `/painel`.
  let ehColaborador = false;
  if (user && (emPainel || emConta)) {
    const { data: membro } = await supabase
      .from("membros")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    ehLeitor = !!membro;
  }
  if (user && emPainel && !emLoginPainel && !ehLeitor) {
    const { data: colaborador } = await supabase
      .from("colaboradores")
      .select("id")
      .eq("id", user.id)
      .eq("ativo", true)
      .maybeSingle();
    ehColaborador = !!colaborador;
  }

  // Rota "de casa" do colaborador — tudo que não começa com isso, dentro
  // de /painel, é fora do alcance dele. /painel/convite/senha entra aqui
  // pra um colaborador recém-convidado conseguir chegar lá antes de ter
  // usado o painel pela primeira vez.
  const ROTAS_COLABORADOR = [
    "/painel/artigos",
    "/painel/novo-artigo",
    "/painel/convite/senha",
  ];
  const dentroDoAlcanceDoColaborador = ROTAS_COLABORADOR.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`),
  );

  if (emPainel && !emLoginPainel && !emAceitarConvite) {
    if (!user || ehLeitor) {
      const url = request.nextUrl.clone();
      url.pathname = "/painel/login";
      return NextResponse.redirect(url);
    }
    // "/painel" sozinho não tem página própria (só as sub-rotas, tipo
    // /painel/conteudo) — sem isso, um admin já logado batendo direto em
    // /painel cai no Next.js sem achar rota e toma 404 de verdade.
    if (pathname === "/painel") {
      const url = request.nextUrl.clone();
      url.pathname = ehColaborador ? "/painel/artigos" : "/painel/conteudo";
      return NextResponse.redirect(url);
    }
    if (ehColaborador && !dentroDoAlcanceDoColaborador) {
      const url = request.nextUrl.clone();
      url.pathname = "/painel/artigos";
      return NextResponse.redirect(url);
    }
  }

  if (emLoginPainel && user && !ehLeitor) {
    const { data: colaborador } = await supabase
      .from("colaboradores")
      .select("id")
      .eq("id", user.id)
      .eq("ativo", true)
      .maybeSingle();
    const url = request.nextUrl.clone();
    url.pathname = colaborador ? "/painel/artigos" : "/painel/conteudo";
    return NextResponse.redirect(url);
  }

  if (emConta && !emContaPublica) {
    if (!user || !ehLeitor) {
      const url = request.nextUrl.clone();
      url.pathname = "/conta/entrar";
      return NextResponse.redirect(url);
    }
  }

  if (emContaPublica && user && ehLeitor) {
    const url = request.nextUrl.clone();
    url.pathname = "/conta";
    return NextResponse.redirect(url);
  }

  return response;
}
