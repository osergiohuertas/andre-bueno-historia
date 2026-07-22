"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLeitorAtual } from "@/lib/leitor";
import { estaSeguindo } from "@/lib/series-seguidas";

type ResultadoSeguir = { ok: true } | { ok: false; erro: string };

export async function buscarEstadoSerie(serieSlug: string): Promise<{
  logado: boolean;
  seguindo: boolean;
}> {
  const leitor = await getLeitorAtual();
  if (!leitor) return { logado: false, seguindo: false };

  const seguindo = await estaSeguindo(leitor.id, serieSlug);
  return { logado: true, seguindo };
}

export async function alternarSeguirSerie(
  serieSlug: string,
  seguirAgora: boolean,
): Promise<ResultadoSeguir> {
  const leitor = await getLeitorAtual();
  if (!leitor) {
    return { ok: false, erro: "Entre na sua conta para seguir uma série." };
  }

  const supabase = await createClient();

  if (seguirAgora) {
    const { error } = await supabase
      .from("seguidores_serie")
      .upsert(
        { membro_id: leitor.id, serie_slug: serieSlug },
        { onConflict: "membro_id,serie_slug" },
      );
    if (error) return { ok: false, erro: "Não foi possível seguir a série." };
  } else {
    const { error } = await supabase
      .from("seguidores_serie")
      .delete()
      .eq("membro_id", leitor.id)
      .eq("serie_slug", serieSlug);
    if (error) return { ok: false, erro: "Não foi possível deixar de seguir." };
  }

  revalidatePath("/conta");
  return { ok: true };
}
