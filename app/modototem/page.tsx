import { TotemApp } from "@/components/totem/TotemApp";
import { getTotemConfig, getFrasesComFallback } from "@/lib/totem";
import { getIdentidadeConfig } from "@/lib/identidade";
import { getSobreConfig } from "@/lib/sobre";
import { getArtigosPorPeriodo, getSeries, type Artigo } from "@/lib/artigos";
import { getAcervoPorPeriodo, type AcervoDocumento } from "@/lib/acervo";
import { getPontosArtigos, getPontosDestinos } from "@/lib/atlas";
import { getDestinos, type Destino } from "@/lib/destinos";
import { extrairPreviaTexto } from "@/lib/mdxPreview";
import { periodosOrdenados, getPeriodo } from "@/data/periodos";
import { SITE_URL } from "@/lib/site";
import type { PeriodoComArtigos } from "@/components/totem/EstadoTimeline";
import type { ArtigoPreviewData } from "@/components/totem/EstadoArtigoPreview";
import type { PeriodoComAcervo } from "@/components/totem/EstadoAcervo";
import type { AcervoPreviewData } from "@/components/totem/EstadoAcervoPreview";
import type { DestinoPreviewData } from "@/components/totem/EstadoDestinoPreview";

export const revalidate = 300;

export default async function ModoTotemPage() {
  const [config, identidade, sobre, pontosDestinos, series, destinos] = await Promise.all([
    getTotemConfig(),
    getIdentidadeConfig(),
    getSobreConfig(),
    getPontosDestinos(),
    getSeries(),
    getDestinos(),
  ]);

  const frases = getFrasesComFallback(config);
  const pontosArtigos = getPontosArtigos();

  const serieInfoPorSlug = new Map(
    series.flatMap((serie) =>
      serie.artigos.map((a) => [
        a.slug,
        {
          nome: serie.nome,
          descricao: serie.descricao,
          parte: a.serieOrdem ?? 1,
          totalPartes: serie.totalPartes,
        },
      ]),
    ),
  );

  function construirArtigoPreview(a: Artigo): ArtigoPreviewData {
    return {
      slug: a.slug,
      titulo: a.titulo,
      excerpt: a.excerpt,
      url: a.url,
      periodoLabel: getPeriodo(a.periodo).label,
      imagemCapa: a.imagemCapa ?? null,
      tags: a.tags,
      leituraMinutos: a.leituraMinutos,
      previaTexto: extrairPreviaTexto(a.slug, "artigos", 90),
      serie: serieInfoPorSlug.get(a.slug) ?? null,
    };
  }

  const periodos: PeriodoComArtigos[] = periodosOrdenados().map((p) => ({
    id: p.id,
    label: p.label,
    artigos: getArtigosPorPeriodo(p.id).map(construirArtigoPreview),
  }));

  function construirAcervoPreview(a: AcervoDocumento): AcervoPreviewData {
    return {
      slug: a.slug,
      titulo: a.titulo,
      excerpt: a.excerpt,
      pdfUrl: a.pdfUrl,
      fonte: a.fonte ?? null,
      imagemCapa: a.imagemCapa ?? null,
      previaTexto: extrairPreviaTexto(a.slug, "acervo-documentos", 90),
      periodoLabel: getPeriodo(a.periodo).label,
    };
  }

  const periodosAcervo: PeriodoComAcervo[] = periodosOrdenados().map((p) => ({
    id: p.id,
    label: p.label,
    documentos: getAcervoPorPeriodo(p.id).map(construirAcervoPreview),
  }));

  function construirDestinoPreview(d: Destino): DestinoPreviewData {
    return {
      slug: d.slug,
      nome: d.nome,
      tipologia: d.tipologia,
      cidade: d.cidade,
      endereco: d.endereco,
      horario: d.horario,
      ingresso: d.ingresso,
      textoAutoral: d.textoAutoral,
      foto: d.foto,
      url: `/destinos/${d.slug}`,
    };
  }

  const destinosPreview = destinos.map(construirDestinoPreview);

  return (
    <TotemApp
      // No resto do site, nome e tagline aparecem como dois elementos
      // visuais separados no cabeçalho (ver Header.tsx). No totem, o topo
      // do menu é uma linha só — junta os dois aqui, sem tocar em
      // identidade.nome (usado em todo o resto do site).
      nomeSite={`${identidade.nome} - ${identidade.tagline}`}
      siteUrl={SITE_URL}
      utmCampaign={config.utmCampaign || config.nomeLocal || "totem"}
      resetSegundos={config.resetSegundos}
      frases={frases}
      periodos={periodos}
      periodosAcervo={periodosAcervo}
      pontosArtigos={pontosArtigos}
      pontosDestinos={pontosDestinos}
      destinos={destinosPreview}
      sobre={{
        manifesto: sobre.manifesto,
        trajetoria: sobre.trajetoria,
        fotoUrl: sobre.fotoUrl,
      }}
    />
  );
}
