import { getArtigosPublicados } from "@/lib/artigos";
import { getAcervoPublicado } from "@/lib/acervo";
import { getDestinos, type Destino } from "@/lib/destinos";
import { getAcervoMidia } from "@/lib/obra";
import { createPublicClient } from "@/lib/supabase/public";
import type { PeriodoId } from "@/data/periodos";

export type TipoPonto = "artigo" | "destino" | "evento" | "trabalho" | "foto";

export type PontoAtlas = {
  tipo: TipoPonto;
  /** slug (artigo, destino, evento, trabalho) ou id (foto). */
  id: string;
  titulo: string;
  subtitulo?: string;
  lat: number;
  lng: number;
  url: string;
  imagem?: string;
  /** Só artigos e trabalhos técnicos — é o que o filtro de período usa. */
  periodo?: PeriodoId;
};

const temLocal = (c?: { lat: number; lng: number } | null): c is { lat: number; lng: number } =>
  !!c && (c.lat !== 0 || c.lng !== 0);

/** Vínculos artigo ↔ destino (camada 3 dos destinos), indexados por artigo. */
async function getDestinosPorArtigo(destinos: Destino[]): Promise<Map<string, Destino>> {
  const porId = new Map(destinos.map((d) => [d.id, d]));
  const resultado = new Map<string, Destino>();
  try {
    const { data } = await createPublicClient()
      .from("destino_artigos")
      .select("destino_id, artigo_slug");
    for (const v of data ?? []) {
      const destino = porId.get(v.destino_id);
      if (destino && !resultado.has(v.artigo_slug)) resultado.set(v.artigo_slug, destino);
    }
  } catch {
    // sem vínculos: artigos só aparecem se tiverem coordenadas próprias
  }
  return resultado;
}

async function getEventosNoMapa() {
  try {
    const { data } = await createPublicClient()
      .from("eventos")
      .select("slug, titulo, cidade, data_inicio, coordenadas")
      .eq("publicado", true)
      .not("coordenadas", "is", null);
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Tudo do site que tem lugar: destinos, artigos (coordenadas próprias ou,
 * na falta delas, o destino a que estão vinculados), eventos da agenda,
 * trabalhos técnicos e fotos com local de registro.
 */
export async function getPontosAtlas(): Promise<PontoAtlas[]> {
  const [destinos, fotos, eventos] = await Promise.all([
    getDestinos(),
    getAcervoMidia("foto"),
    getEventosNoMapa(),
  ]);
  const vinculos = await getDestinosPorArtigo(destinos);
  const pontos: PontoAtlas[] = [];

  for (const d of destinos) {
    if (!temLocal(d.coordenadas)) continue;
    pontos.push({
      tipo: "destino",
      id: d.slug,
      titulo: d.nome,
      subtitulo: [d.tipologias.join(" · "), d.cidade].filter(Boolean).join(" — "),
      lat: d.coordenadas.lat,
      lng: d.coordenadas.lng,
      url: `/destinos/${d.slug}`,
      imagem: d.foto ?? undefined,
    });
  }

  for (const a of getArtigosPublicados()) {
    const destino = vinculos.get(a.slug);
    const coords = temLocal(a.coordenadas) ? a.coordenadas : destino?.coordenadas;
    if (!temLocal(coords)) continue;
    pontos.push({
      tipo: "artigo",
      id: a.slug,
      titulo: a.titulo,
      subtitulo: temLocal(a.coordenadas) ? a.regiao : `Em ${destino!.nome}`,
      lat: coords.lat,
      lng: coords.lng,
      url: a.url,
      imagem: a.imagemCapa,
      periodo: a.periodo,
    });
  }

  for (const t of getAcervoPublicado()) {
    if (!temLocal(t.coordenadas)) continue;
    pontos.push({
      tipo: "trabalho",
      id: t.slug,
      titulo: t.titulo,
      subtitulo: t.regiao,
      lat: t.coordenadas.lat,
      lng: t.coordenadas.lng,
      url: t.url,
      imagem: t.imagemCapa,
      periodo: t.periodo,
    });
  }

  for (const e of eventos) {
    if (!temLocal(e.coordenadas)) continue;
    pontos.push({
      tipo: "evento",
      id: e.slug,
      titulo: e.titulo,
      subtitulo: `${new Date(e.data_inicio).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })} — ${e.cidade}`,
      lat: e.coordenadas.lat,
      lng: e.coordenadas.lng,
      url: `/eventos/${e.slug}`,
    });
  }

  for (const f of fotos) {
    if (f.lat == null || f.lng == null) continue;
    pontos.push({
      tipo: "foto",
      id: f.id,
      titulo: f.titulo,
      subtitulo: f.credito ? `Crédito: ${f.credito}` : undefined,
      lat: f.lat,
      lng: f.lng,
      url: "/acervo?secao=fotos",
      imagem: f.url,
    });
  }

  return pontos;
}
