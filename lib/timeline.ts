import { getArtigosPublicados } from "@/lib/artigos";
import { getAcervoPublicado } from "@/lib/acervo";
import { periodosOrdenados, type Periodo, type PeriodoId } from "@/data/periodos";

export type ItemLinhaDoTempo = {
  tipo: "artigo" | "acervo";
  slug: string;
  titulo: string;
  excerpt: string;
  periodo: PeriodoId;
  anoInicio: number;
  anoFim?: number;
  url: string;
  imagemCapa?: string;
};

/**
 * A linha do tempo não tem dado próprio — é inteiramente derivada de
 * artigos e acervo via `periodo`. Publicar um artigo novo faz ele aparecer
 * aqui sem tocar em nada desta função. Só o período primário do item conta
 * pra posição no eixo; períodos secundários são referência cruzada, não
 * duplicam a posição.
 */
function getTodosOsItens(): ItemLinhaDoTempo[] {
  const artigos: ItemLinhaDoTempo[] = getArtigosPublicados().map((a) => ({
    tipo: "artigo",
    slug: a.slug,
    titulo: a.titulo,
    excerpt: a.excerpt,
    periodo: a.periodo,
    anoInicio: a.anoInicio,
    anoFim: a.anoFim,
    url: a.url,
    imagemCapa: a.imagemCapa,
  }));

  const acervo: ItemLinhaDoTempo[] = getAcervoPublicado().map((a) => ({
    tipo: "acervo",
    slug: a.slug,
    titulo: a.titulo,
    excerpt: a.excerpt,
    periodo: a.periodo,
    anoInicio: a.anoInicio,
    anoFim: a.anoFim,
    url: a.url,
    imagemCapa: a.imagemCapa,
  }));

  return [...artigos, ...acervo];
}

export type FaixaLinhaDoTempo = { periodo: Periodo; itens: ItemLinhaDoTempo[] };

/**
 * Uma faixa por período do eixo cronológico (transversal fica de fora —
 * ver getConteudoTransversal). Período sem nenhum item ainda entra na
 * lista, com `itens: []`: a lacuna é informação, não é escondida.
 */
export function getLinhaDoTempo(): FaixaLinhaDoTempo[] {
  const todos = getTodosOsItens();

  return periodosOrdenados().map((periodo) => ({
    periodo,
    itens: todos
      .filter((item) => item.periodo === periodo.id)
      .sort((a, b) => a.anoInicio - b.anoInicio),
  }));
}

export function getConteudoTransversal(): ItemLinhaDoTempo[] {
  return getTodosOsItens()
    .filter((item) => item.periodo === "transversal")
    .sort((a, b) => a.titulo.localeCompare(b.titulo));
}

export function getConteudoPorPeriodo(periodoId: PeriodoId): ItemLinhaDoTempo[] {
  return getTodosOsItens()
    .filter((item) => item.periodo === periodoId)
    .sort((a, b) => a.anoInicio - b.anoInicio);
}
