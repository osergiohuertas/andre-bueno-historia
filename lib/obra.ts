import { createPublicClient } from "@/lib/supabase/public";

export type TipoPublicacao = "livro" | "artigo_academico" | "capitulo" | "ensaio";
export type CategoriaVideo = "entrevista" | "congresso" | "simposio" | "seminario";

export type Publicacao = {
  slug: string;
  titulo: string;
  tipo: TipoPublicacao;
  veiculo: string;
  ano: number;
  coautores: string | null;
  link: string | null;
  resumo: string | null;
  capa: string | null;
};

export type Midia = {
  id: string;
  tipo: "video" | "foto";
  titulo: string;
  descricao: string | null;
  categoria: string | null;
  url: string;
  credito: string | null;
  data: string | null;
};

export async function getPublicacoes(
  tipos: TipoPublicacao[],
): Promise<Publicacao[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("publicacoes")
      .select("slug, titulo, tipo, veiculo, ano, coautores, link, resumo, capa")
      .eq("publicado", true)
      .in("tipo", tipos)
      .order("ano", { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getAcervoMidia(
  tipo: "video" | "foto",
  categoria?: CategoriaVideo,
): Promise<Midia[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("acervo_midia")
      .select("id, tipo, titulo, descricao, categoria, url, credito, data")
      .eq("publicado", true)
      .eq("tipo", tipo);

    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query.order("data", { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
