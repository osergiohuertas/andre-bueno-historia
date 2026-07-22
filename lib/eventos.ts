import { createPublicClient } from "@/lib/supabase/public";
import type { Coordenadas } from "@/types/supabase";

export type Natureza = "cultural" | "academico";
export type Participacao = "curadoria" | "com_andre";

export type Evento = {
  slug: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  natureza: Natureza;
  participacao: Participacao;
  local: string;
  cidade: string;
  endereco: string | null;
  coordenadas: Coordenadas | null;
  organizador: string;
  linkInscricao: string | null;
  imagemCapa: string | null;
};

/**
 * Ordenação da agenda: eventos com participação do André sobem dentro da
 * mesma janela temporal (mesmo mês); fora disso, cronológica ascendente.
 * "Janela temporal" = mês/ano de data_inicio, não um intervalo fixo em dias.
 */
function compararAgenda(a: Evento, b: Evento): number {
  const inicioA = new Date(a.dataInicio);
  const inicioB = new Date(b.dataInicio);
  const mesmaJanela =
    inicioA.getFullYear() === inicioB.getFullYear() &&
    inicioA.getMonth() === inicioB.getMonth();

  if (mesmaJanela && a.participacao !== b.participacao) {
    return a.participacao === "com_andre" ? -1 : 1;
  }

  return inicioA.getTime() - inicioB.getTime();
}

async function getTodosEventosPublicados(): Promise<Evento[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .eq("publicado", true);

    if (error || !data) return [];

    return data.map((e) => ({
      slug: e.slug,
      titulo: e.titulo,
      descricao: e.descricao,
      dataInicio: e.data_inicio,
      dataFim: e.data_fim,
      natureza: e.natureza,
      participacao: e.participacao,
      local: e.local,
      cidade: e.cidade,
      endereco: e.endereco,
      coordenadas: e.coordenadas,
      organizador: e.organizador,
      linkInscricao: e.link_inscricao,
      imagemCapa: e.imagem_capa,
    }));
  } catch {
    return [];
  }
}

export async function getEventosFuturos(filtro?: {
  natureza?: Natureza;
  participacao?: Participacao;
}): Promise<Evento[]> {
  const agora = new Date();
  const todos = await getTodosEventosPublicados();

  return todos
    .filter((e) => new Date(e.dataFim) >= agora)
    .filter((e) => !filtro?.natureza || e.natureza === filtro.natureza)
    .filter(
      (e) => !filtro?.participacao || e.participacao === filtro.participacao,
    )
    .sort(compararAgenda);
}

export async function getEventosArquivo(): Promise<Evento[]> {
  const agora = new Date();
  const todos = await getTodosEventosPublicados();

  return todos
    .filter((e) => new Date(e.dataFim) < agora)
    .sort(
      (a, b) => new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime(),
    );
}

export async function getEventoPorSlug(slug: string): Promise<Evento | undefined> {
  const todos = await getTodosEventosPublicados();
  return todos.find((e) => e.slug === slug);
}
