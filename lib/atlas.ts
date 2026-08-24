import { getArtigosPublicados } from "@/lib/artigos";
import { getDestinos } from "@/lib/destinos";
import { getAcervoMidia } from "@/lib/obra";
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
  tipologias: string[];
  lat: number;
  lng: number;
  url: string;
};

export type PontoFoto = {
  tipo: "foto";
  id: string;
  titulo: string;
  url: string;
  lat: number;
  lng: number;
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
    tipologias: d.tipologias,
    lat: d.coordenadas.lat,
    lng: d.coordenadas.lng,
    url: `/destinos/${d.slug}`,
  }));
}

/**
 * Fotos com local de registro (lat/lng) preenchido no painel — só essas
 * aparecem no Atlas, o resto do acervo de fotos continua só em /acervo.
 */
export async function getPontosFotos(): Promise<PontoFoto[]> {
  const fotos = await getAcervoMidia("foto");
  return fotos
    .filter((f) => f.lat != null && f.lng != null)
    .map((f) => ({
      tipo: "foto" as const,
      id: f.id,
      titulo: f.titulo,
      url: f.url,
      lat: f.lat as number,
      lng: f.lng as number,
    }));
}
