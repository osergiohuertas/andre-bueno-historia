import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

const ROTAS_CONTA_PUBLICAS = ["/conta/cadastro", "/conta/entrar"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const emPainel = pathname.startsWith("/painel");
  const emLoginPainel = pathname === "/painel/login";
  const emConta = pathname.startsWith("/conta");
  const emContaPublica = ROTAS_CONTA_PUBLICAS.includes(pathname);

  // Supabase não configurado ainda (sem projeto provisionado): trata como
  // "sem sessão" em vez de quebrar a rota inteira. /painel/login e
  // /conta/entrar mostram a mensagem explicando o que falta.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    if (emPainel && !emLoginPainel) {
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
  if (user && (emPainel || emConta)) {
    const { data: membro } = await supabase
      .from("membros")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    ehLeitor = !!membro;
  }

  if (emPainel && !emLoginPainel) {
    if (!user || ehLeitor) {
      const url = request.nextUrl.clone();
      url.pathname = "/painel/login";
      return NextResponse.redirect(url);
    }
  }

  if (emLoginPainel && user && !ehLeitor) {
    const url = request.nextUrl.clone();
    url.pathname = "/painel/conteudo";
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
