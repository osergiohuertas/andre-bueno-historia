import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SessaoPainel =
  | { papel: "admin"; userId: string }
  | { papel: "colaborador"; userId: string; nome: string };

/**
 * Papel de quem está logado no painel — mesmo padrão de "linha em tabela
 * define o papel" que `ehLeitor` já usa em lib/supabase/middleware.ts.
 * `null` cobre tanto "sem sessão" quanto "é leitor" (nunca deveria chegar
 * em código de painel, mas não é papel de painel de qualquer forma).
 *
 * Middleware já bloqueia rota por rota para colaborador (ver
 * lib/supabase/middleware.ts) — isto aqui é a segunda camada, usada
 * dentro de layouts/actions pra decidir o que renderizar/permitir e pra
 * checar dono de recurso (ex.: só o autor apaga o próprio artigo).
 */
export async function getSessaoPainel(): Promise<SessaoPainel | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: colaborador } = await supabase
    .from("colaboradores")
    .select("nome")
    .eq("id", user.id)
    .eq("ativo", true)
    .maybeSingle();

  if (colaborador) {
    return { papel: "colaborador", userId: user.id, nome: colaborador.nome };
  }

  return { papel: "admin", userId: user.id };
}

/**
 * Guarda de uma linha pro topo de toda server action que só admin pode
 * executar (qualquer coisa fora de artigos/novo-artigo). Colaborador
 * autenticado que chegar aqui (rota vazada, ou POST direto na action)
 * toma erro em vez de escrever.
 */
export async function exigirAdmin(): Promise<
  { ok: true } | { ok: false; mensagem: string }
> {
  const sessao = await getSessaoPainel();
  if (sessao?.papel !== "admin") {
    return { ok: false, mensagem: "Sem permissão." };
  }
  return { ok: true };
}
