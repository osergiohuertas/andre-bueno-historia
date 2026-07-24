import { createPublicClient } from "@/lib/supabase/public";
import { slugificar } from "@/lib/artigos";
import type { Coordenadas } from "@/types/supabase";

export type Destino = {
  id: string;
  slug: string;
  nome: string;
  cidade: string;
  endereco: string;
  coordenadas: Coordenadas;
  horario: string;
  ingresso: string;
  telefone: string | null;
  site: string | null;
  foto: string | null;
  tipologia: string;
  dataVerificacao: string;
  textoAutoral: string | null;
};

export const TIPOLOGIAS_DESTINO = [
  "Museu",
  "Patrimônio Cultural",
  "Lugar",
] as const;

async function getTodosOsDestinos(): Promise<Destino[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("destinos")
      .select("*")
      .eq("publicado", true);

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      slug: d.slug,
      nome: d.nome,
      cidade: d.cidade,
      endereco: d.endereco,
      coordenadas: d.coordenadas,
      horario: d.horario,
      ingresso: d.ingresso,
      telefone: d.telefone,
      site: d.site,
      foto: d.foto,
      tipologia: d.tipologia,
      dataVerificacao: d.data_verificacao,
      textoAutoral: d.texto_autoral,
    }));
  } catch {
    return [];
  }
}

export async function getDestinos(): Promise<Destino[]> {
  const destinos = await getTodosOsDestinos();
  return destinos.sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function getDestinoPorSlug(
  slug: string,
): Promise<Destino | undefined> {
  const destinos = await getTodosOsDestinos();
  return destinos.find((d) => d.slug === slug);
}

export async function getDestinosPorCidade(cidade: string): Promise<Destino[]> {
  const destinos = await getDestinos();
  return destinos.filter(
    (d) => slugificar(d.cidade) === slugificar(cidade),
  );
}

export async function getDestinosPorTipologia(
  tipologia: string,
): Promise<Destino[]> {
  const destinos = await getDestinos();
  return destinos.filter(
    (d) => slugificar(d.tipologia) === slugificar(tipologia),
  );
}

export async function getCidadesComDestinos(): Promise<string[]> {
  const destinos = await getDestinos();
  return Array.from(new Set(destinos.map((d) => d.cidade))).sort();
}

export async function getTipologiasComDestinos(): Promise<string[]> {
  const destinos = await getDestinos();
  return Array.from(new Set(destinos.map((d) => d.tipologia))).sort();
}

/**
 * Camada 3: artigos vinculados a este destino. Retorna só os slugs — quem
 * chama resolve pra Artigo completo via getArtigoBySlug (lib/artigos.ts),
 * já que destino_artigos não tem FK pro MDX.
 */
export async function getArtigoSlugsVinculadosAoDestino(
  destinoId: string,
): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("destino_artigos")
      .select("artigo_slug")
      .eq("destino_id", destinoId);

    if (error || !data) return [];
    return data.map((v) => v.artigo_slug);
  } catch {
    return [];
  }
}
