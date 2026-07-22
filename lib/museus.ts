import { createPublicClient } from "@/lib/supabase/public";
import { slugificar } from "@/lib/artigos";
import type { Coordenadas } from "@/types/supabase";

export type Museu = {
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

async function getTodosOsMuseus(): Promise<Museu[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("museus")
      .select("*")
      .eq("publicado", true);

    if (error || !data) return [];

    return data.map((m) => ({
      id: m.id,
      slug: m.slug,
      nome: m.nome,
      cidade: m.cidade,
      endereco: m.endereco,
      coordenadas: m.coordenadas,
      horario: m.horario,
      ingresso: m.ingresso,
      telefone: m.telefone,
      site: m.site,
      foto: m.foto,
      tipologia: m.tipologia,
      dataVerificacao: m.data_verificacao,
      textoAutoral: m.texto_autoral,
    }));
  } catch {
    return [];
  }
}

export async function getMuseus(): Promise<Museu[]> {
  const museus = await getTodosOsMuseus();
  return museus.sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function getMuseuPorSlug(slug: string): Promise<Museu | undefined> {
  const museus = await getTodosOsMuseus();
  return museus.find((m) => m.slug === slug);
}

export async function getMuseusPorCidade(cidade: string): Promise<Museu[]> {
  const museus = await getMuseus();
  return museus.filter(
    (m) => slugificar(m.cidade) === slugificar(cidade),
  );
}

export async function getMuseusPorTipologia(tipologia: string): Promise<Museu[]> {
  const museus = await getMuseus();
  return museus.filter(
    (m) => slugificar(m.tipologia) === slugificar(tipologia),
  );
}

export async function getCidadesComMuseus(): Promise<string[]> {
  const museus = await getMuseus();
  return Array.from(new Set(museus.map((m) => m.cidade))).sort();
}

export async function getTipologiasComMuseus(): Promise<string[]> {
  const museus = await getMuseus();
  return Array.from(new Set(museus.map((m) => m.tipologia))).sort();
}

/**
 * Camada 3: artigos vinculados a este museu. Retorna só os slugs — quem
 * chama resolve pra Artigo completo via getArtigoBySlug (lib/artigos.ts),
 * já que museu_artigos não tem FK pro MDX.
 */
export async function getArtigoSlugsVinculadosAoMuseu(
  museuId: string,
): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("museu_artigos")
      .select("artigo_slug")
      .eq("museu_id", museuId);

    if (error || !data) return [];
    return data.map((v) => v.artigo_slug);
  } catch {
    return [];
  }
}
