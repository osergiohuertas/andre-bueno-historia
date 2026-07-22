"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLeitorAtual } from "@/lib/leitor";
import { getEstadoArtigo } from "@/lib/biblioteca";

type ResultadoBiblioteca = { ok: true } | { ok: false; erro: string };

/**
 * Chamada pelo client component ao montar — mantém /artigos/[slug]
 * estático/ISR (sem cookies no render do servidor) e busca o estado
 * pessoal (logado? salvo? lido?) só no navegador, depois da hidratação.
 */
export async function buscarEstadoBiblioteca(artigoSlug: string): Promise<{
  logado: boolean;
  salvo: boolean;
  lido: boolean;
}> {
  const leitor = await getLeitorAtual();
  if (!leitor) return { logado: false, salvo: false, lido: false };

  const estado = await getEstadoArtigo(leitor.id, artigoSlug);
  return { logado: true, ...estado };
}

async function upsertEstado(
  artigoSlug: string,
  parcial: { salvo?: boolean; lido?: boolean },
): Promise<ResultadoBiblioteca> {
  const leitor = await getLeitorAtual();
  if (!leitor) {
    return { ok: false, erro: "Entre na sua conta para salvar artigos." };
  }

  const supabase = await createClient();
  const agora = new Date().toISOString();

  const dados: {
    membro_id: string;
    artigo_slug: string;
    salvo?: boolean;
    lido?: boolean;
    salvo_em?: string;
    lido_em?: string;
  } = { membro_id: leitor.id, artigo_slug: artigoSlug, ...parcial };

  if (parcial.salvo === true) dados.salvo_em = agora;
  if (parcial.lido === true) dados.lido_em = agora;

  const { error } = await supabase
    .from("biblioteca_pessoal")
    .upsert(dados, { onConflict: "membro_id,artigo_slug" });

  if (error) return { ok: false, erro: "Não foi possível salvar." };

  // A página do artigo é estática/ISR e não guarda estado pessoal — só
  // /conta/biblioteca (renderizada por leitor) precisa revalidar.
  revalidatePath("/conta/biblioteca");
  return { ok: true };
}

export async function alternarSalvo(
  artigoSlug: string,
  salvarAgora: boolean,
): Promise<ResultadoBiblioteca> {
  return upsertEstado(artigoSlug, { salvo: salvarAgora });
}

export async function alternarLido(
  artigoSlug: string,
  marcarAgora: boolean,
): Promise<ResultadoBiblioteca> {
  return upsertEstado(artigoSlug, { lido: marcarAgora });
}
