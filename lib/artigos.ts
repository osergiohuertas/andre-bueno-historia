import { artigos } from "@/.velite";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";
import { createPublicClient } from "@/lib/supabase/public";

export type { Artigo } from "@/.velite";

export function getArtigosPublicados() {
  return artigos
    .filter((a) => a.publicado)
    .sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function getArtigoBySlug(slug: string) {
  return getArtigosPublicados().find((a) => a.slug === slug);
}

export function getArtigosConectadosAoLivro() {
  return getArtigosPublicados().filter((a) => a.conexaoLivro);
}

export function getArtigosPorPeriodo(periodo: PeriodoId) {
  return getArtigosPublicados().filter(
    (a) => a.periodo === periodo || a.periodosSecundarios?.includes(periodo),
  );
}

export function getArtigosPorTag(tag: string) {
  return getArtigosPublicados().filter((a) =>
    a.tags.some((t) => slugificar(t) === slugificar(tag)),
  );
}

export function getArtigosPorRegiao(regiao: string) {
  return getArtigosPublicados().filter(
    (a) => a.regiao && slugificar(a.regiao) === slugificar(regiao),
  );
}

export function filtrarArtigos(filtros: {
  periodo?: PeriodoId;
  regiao?: string;
  tag?: string;
}) {
  return getArtigosPublicados().filter((a) => {
    if (
      filtros.periodo &&
      a.periodo !== filtros.periodo &&
      !a.periodosSecundarios?.includes(filtros.periodo)
    ) {
      return false;
    }
    if (
      filtros.regiao &&
      (!a.regiao || slugificar(a.regiao) !== slugificar(filtros.regiao))
    ) {
      return false;
    }
    if (
      filtros.tag &&
      !a.tags.some((t) => slugificar(t) === slugificar(filtros.tag as string))
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Conta TODOS os artigos por período — publicados e rascunhos. É o que o
 * André vê no seletor de período do editor: a obra completa, não só o que
 * já está no ar, porque é isso que revela as lacunas de verdade.
 */
export function contarArtigosPorPeriodo(): Record<PeriodoId, number> {
  const contagem = {} as Record<PeriodoId, number>;
  for (const a of artigos) {
    contagem[a.periodo] = (contagem[a.periodo] ?? 0) + 1;
  }
  return contagem;
}

export function getPeriodosComConteudo(): Set<PeriodoId> {
  const set = new Set<PeriodoId>();
  for (const a of getArtigosPublicados()) {
    set.add(a.periodo);
    a.periodosSecundarios?.forEach((p) => set.add(p));
  }
  return set;
}

export function getTagsComConteudo(): string[] {
  const set = new Set<string>();
  for (const a of getArtigosPublicados()) a.tags.forEach((t) => set.add(t));
  return Array.from(set).sort();
}

export function getRegioesComConteudo(): string[] {
  const set = new Set<string>();
  for (const a of getArtigosPublicados()) if (a.regiao) set.add(a.regiao);
  return Array.from(set).sort();
}

export type Serie = {
  slug: string;
  numero: string;
  nome: string;
  descricao: string | null;
  totalPartes: number | null;
  artigos: (typeof artigos)[number][];
};

/**
 * Séries vivem no Supabase (Fase 1D) — o André cria uma nova sem commit.
 * O artigo em MDX só guarda o `serie` = slug da série; numero/nome/descrição
 * vêm do banco. Se o Supabase não responder, não há fallback de conteúdo
 * fake: a lista fica vazia (mostra menos, nunca inventa metadado).
 */
export async function getSeries(): Promise<Serie[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("series")
      .select("slug, numero, nome, descricao, total_partes")
      .eq("publicado", true)
      .order("ordem", { ascending: true });

    if (error || !data) return [];

    const publicados = getArtigosPublicados();

    return data
      .map((serie) => ({
        slug: serie.slug,
        numero: serie.numero,
        nome: serie.nome,
        descricao: serie.descricao,
        totalPartes: serie.total_partes,
        artigos: publicados
          .filter((a) => a.serie === serie.slug)
          .sort((a, b) => (a.serieOrdem ?? 0) - (b.serieOrdem ?? 0)),
      }))
      .filter((serie) => serie.artigos.length > 0);
  } catch {
    return [];
  }
}

export async function getSeriePorSlug(slug: string): Promise<Serie | undefined> {
  const series = await getSeries();
  return series.find((s) => s.slug === slug);
}

/**
 * Artigos relacionados: mesmo período > período adjacente no eixo
 * cronológico > qualquer outro artigo publicado, mais recente primeiro.
 */
export function getArtigosRelacionados(
  artigo: (typeof artigos)[number],
  limite = 3,
) {
  const ordem = periodosOrdenados();
  const indiceAtual = ordem.findIndex((p) => p.id === artigo.periodo);

  const distancia = (candidato: (typeof artigos)[number]) => {
    if (candidato.periodo === artigo.periodo) return 0;
    if (indiceAtual === -1) return 2;
    const indiceCandidato = ordem.findIndex((p) => p.id === candidato.periodo);
    if (indiceCandidato === -1) return 2;
    return Math.abs(indiceCandidato - indiceAtual) === 1 ? 1 : 2;
  };

  return getArtigosPublicados()
    .filter((a) => a.slug !== artigo.slug)
    .sort((a, b) => {
      const diff = distancia(a) - distancia(b);
      if (diff !== 0) return diff;
      return a.data < b.data ? 1 : -1;
    })
    .slice(0, limite);
}

function slugificar(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export { slugificar };
