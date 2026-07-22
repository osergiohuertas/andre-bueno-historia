import { createClient } from "@/lib/supabase/server";

export type ItemBiblioteca = {
  artigoSlug: string;
  salvo: boolean;
  lido: boolean;
  salvoEm: string | null;
  lidoEm: string | null;
};

export async function getBibliotecaDoMembro(
  membroId: string,
): Promise<ItemBiblioteca[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("biblioteca_pessoal")
    .select("artigo_slug, salvo, lido, salvo_em, lido_em")
    .eq("membro_id", membroId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d) => ({
    artigoSlug: d.artigo_slug,
    salvo: d.salvo,
    lido: d.lido,
    salvoEm: d.salvo_em,
    lidoEm: d.lido_em,
  }));
}

export async function getEstadoArtigo(
  membroId: string,
  artigoSlug: string,
): Promise<{ salvo: boolean; lido: boolean }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("biblioteca_pessoal")
    .select("salvo, lido")
    .eq("membro_id", membroId)
    .eq("artigo_slug", artigoSlug)
    .maybeSingle();

  return { salvo: data?.salvo ?? false, lido: data?.lido ?? false };
}
