import { getArtigosPublicados } from "@/lib/artigos";
import { getDestinos } from "@/lib/destinos";
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

export type PontoDestino = {
  tipo: "destino";
  slug: string;
  titulo: string;
  tipologia: string;
  lat: number;
  lng: number;
  url: string;
};

/**
 * Artigos georreferenciados — só os que declaram `coordenadas`, não todos.
 * Destinos não têm `periodo` (são atemporais por natureza: um destino
 * existe hoje, independente de qual período documenta), então o filtro
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

export async function getPontosDestinos(): Promise<PontoDestino[]> {
  const destinos = await getDestinos();
  return destinos.map((d) => ({
    tipo: "destino" as const,
    slug: d.slug,
    titulo: d.nome,
    tipologia: d.tipologia,
    lat: d.coordenadas.lat,
    lng: d.coordenadas.lng,
    url: `/destinos/${d.slug}`,
  }));
}
