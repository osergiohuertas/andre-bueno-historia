import { getArtigosPublicados } from "@/lib/artigos";
import { getMuseus } from "@/lib/museus";
import type { PeriodoId } from "@/data/periodos";

export type PontoArtigo = {
  tipo: "artigo";
  slug: string;
  titulo: string;
  periodo: PeriodoId;
  anoInicio: number;
  lat: number;
  lng: number;
  url: string;
};

export type PontoMuseu = {
  tipo: "museu";
  slug: string;
  titulo: string;
  tipologia: string;
  lat: number;
  lng: number;
  url: string;
};

/**
 * Artigos georreferenciados — só os que declaram `coordenadas`, não todos.
 * Museus não têm `periodo` (são atemporais por natureza: um museu existe
 * hoje, independente de qual período seu acervo documenta), então o filtro
 * temporal do Atlas se aplica só à camada de artigos — ver AtlasMapa.
 */
export function getPontosArtigos(): PontoArtigo[] {
  return getArtigosPublicados()
    .filter((a) => a.coordenadas)
    .map((a) => ({
      tipo: "artigo" as const,
      slug: a.slug,
      titulo: a.titulo,
      periodo: a.periodo,
      anoInicio: a.anoInicio,
      lat: a.coordenadas!.lat,
      lng: a.coordenadas!.lng,
      url: a.url,
    }));
}

export async function getPontosMuseus(): Promise<PontoMuseu[]> {
  const museus = await getMuseus();
  return museus.map((m) => ({
    tipo: "museu" as const,
    slug: m.slug,
    titulo: m.nome,
    tipologia: m.tipologia,
    lat: m.coordenadas.lat,
    lng: m.coordenadas.lng,
    url: `/museus/${m.slug}`,
  }));
}
