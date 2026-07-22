"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLeitorAtual } from "@/lib/leitor";

export type ResultadoExportacao =
  | { ok: true; dados: Record<string, unknown> }
  | { ok: false; erro: string };

/**
 * Exportação LGPD: tudo que o leitor tem no banco, num JSON só. Sem
 * filtro nem resumo — dado bruto, pra ele levar pra onde quiser.
 */
export async function exportarMeusDados(): Promise<ResultadoExportacao> {
  const leitor = await getLeitorAtual();
  if (!leitor) return { ok: false, erro: "Você precisa estar logado." };

  const supabase = await createClient();

  const [{ data: membro }, { data: biblioteca }, { data: seriesSeguidas }] =
    await Promise.all([
      supabase.from("membros").select("*").eq("id", leitor.id).single(),
      supabase
        .from("biblioteca_pessoal")
        .select("*")
        .eq("membro_id", leitor.id),
      supabase
        .from("seguidores_serie")
        .select("*")
        .eq("membro_id", leitor.id),
    ]);

  return {
    ok: true,
    dados: {
      exportadoEm: new Date().toISOString(),
      perfil: { ...membro, email: leitor.email },
      biblioteca: biblioteca ?? [],
      seriesSeguidas: seriesSeguidas ?? [],
    },
  };
}

export type ResultadoExclusao = { ok: true } | { ok: false; erro: string };

/**
 * Apaga a conta de verdade: deleteUser no Auth cascade-apaga membros,
 * biblioteca_pessoal e seguidores_serie via FK — não sobra rastro.
 */
export async function excluirMinhaConta(): Promise<ResultadoExclusao> {
  const leitor = await getLeitorAtual();
  if (!leitor) return { ok: false, erro: "Você precisa estar logado." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(leitor.id);

  if (error) {
    return { ok: false, erro: "Não foi possível excluir a conta." };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
