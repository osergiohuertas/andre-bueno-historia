import { opinioes } from "@/.velite";
import { getArtigoBySlug } from "@/lib/artigos";

export type { Opiniao } from "@/.velite";

export function getOpinioesPublicadas() {
  return opinioes
    .filter((o) => o.publicado)
    .sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function getOpiniaoBySlug(slug: string) {
  return getOpinioesPublicadas().find((o) => o.slug === slug);
}

/**
 * A peça em evidência no topo de /opiniao: a marcada como `destaque`, ou —
 * se nenhuma estiver marcada — a mais recente. Nunca fica sem destaque
 * havendo ao menos uma peça publicada.
 */
export function getOpiniaoDestaque() {
  const publicadas = getOpinioesPublicadas();
  return publicadas.find((o) => o.destaque) ?? publicadas[0];
}

/**
 * Resolve os `artigosRelacionados` (slugs) de uma peça para os artigos
 * históricos publicados correspondentes — descarta em silêncio qualquer
 * slug que não exista ou não esteja publicado (o artigo pode ter saído do ar
 * depois que a opinião foi escrita).
 */
export function getArtigosDaBaseHistorica(slugs: string[] | undefined) {
  if (!slugs?.length) return [];
  return slugs
    .map((slug) => getArtigoBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
}
