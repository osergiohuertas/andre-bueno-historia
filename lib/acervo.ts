import { acervoDocumentos } from "@/.velite";
import { type PeriodoId } from "@/data/periodos";
import { slugificar } from "@/lib/artigos";

export type { AcervoDocumento } from "@/.velite";

export function getAcervoPublicado() {
  return acervoDocumentos
    .filter((a) => a.publicado)
    .sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function getAcervoPorSlug(slug: string) {
  return getAcervoPublicado().find((a) => a.slug === slug);
}

export function getAcervoPorPeriodo(periodo: PeriodoId) {
  return getAcervoPublicado().filter(
    (a) => a.periodo === periodo || a.periodosSecundarios?.includes(periodo),
  );
}

export function filtrarAcervo(filtros: { periodo?: PeriodoId; tag?: string }) {
  return getAcervoPublicado().filter((a) => {
    if (
      filtros.periodo &&
      a.periodo !== filtros.periodo &&
      !a.periodosSecundarios?.includes(filtros.periodo)
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

export function getPeriodosComAcervo(): Set<PeriodoId> {
  const set = new Set<PeriodoId>();
  for (const a of getAcervoPublicado()) {
    set.add(a.periodo);
    a.periodosSecundarios?.forEach((p) => set.add(p));
  }
  return set;
}

/** Todos os itens, publicados ou não — uso exclusivo do painel. */
export function getTodosAcervoDocumentos() {
  return [...acervoDocumentos].sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function contarAcervoPorPeriodo(): Partial<Record<PeriodoId, number>> {
  const contagem: Partial<Record<PeriodoId, number>> = {};
  for (const a of acervoDocumentos) {
    contagem[a.periodo] = (contagem[a.periodo] ?? 0) + 1;
  }
  return contagem;
}
