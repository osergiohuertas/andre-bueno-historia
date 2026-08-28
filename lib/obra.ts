import { createPublicClient } from "@/lib/supabase/public";

export type TipoPublicacao = "livro" | "artigo_academico" | "capitulo" | "ensaio";
export type CategoriaVideo =
  | "entrevista"
  | "congresso"
  | "simposio"
  | "seminario"
  | "documentario"
  | "reportagem";

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
  lat: number | null;
  lng: number | null;
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

export async function getPublicacaoPorSlug(
  slug: string,
): Promise<Publicacao | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("publicacoes")
      .select("slug, titulo, tipo, veiculo, ano, coautores, link, resumo, capa")
      .eq("publicado", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
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
      .select("id, tipo, titulo, descricao, categoria, url, credito, data, lat, lng")
      .eq("publicado", true)
      .eq("tipo", tipo);

    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query.order("data", { ascending: false });

    // `lat`/`lng` só existem depois da migration 20260811000001 rodar no
    // Supabase — até lá, pedir essas colunas quebra a query inteira
    // (42703 "column does not exist") e some com todo vídeo/foto do
    // site, não só os novos. Refaz sem elas nesse cenário específico, pra
    // não deixar a listagem inteira refém de uma migration pendente.
    if (error?.code === "42703") {
      let querySemLocal = supabase
        .from("acervo_midia")
        .select("id, tipo, titulo, descricao, categoria, url, credito, data")
        .eq("publicado", true)
        .eq("tipo", tipo);
      if (categoria) {
        querySemLocal = querySemLocal.eq("categoria", categoria);
      }
      const { data: dataSemLocal, error: erroSemLocal } =
        await querySemLocal.order("data", { ascending: false });
      if (erroSemLocal || !dataSemLocal) return [];
      return dataSemLocal.map((m) => ({ ...m, lat: null, lng: null }));
    }

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
