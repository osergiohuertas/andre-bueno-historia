import { Hero } from "@/components/home/Hero";
import { RecentArticlesGrid } from "@/components/home/RecentArticlesGrid";
import { TimelinePreview } from "@/components/home/TimelinePreview";
import { SeriesPreview } from "@/components/home/SeriesPreview";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getArtigosPublicados,
  getPeriodosComConteudo,
  getSeries,
} from "@/lib/artigos";
import { getHomeConfig } from "@/lib/home";

export default async function Home() {
  const artigos = getArtigosPublicados();
  const series = await getSeries();
  const config = await getHomeConfig();

  if (artigos.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="meta text-chumbo-lt">Nenhum artigo publicado ainda.</p>
      </div>
    );
  }

  const anos = artigos.reduce(
    (span, artigo) => {
      const fim = artigo.anoFim ?? artigo.anoInicio;
      return {
        min: Math.min(span.min, artigo.anoInicio),
        max: Math.max(span.max, fim),
      };
    },
    { min: artigos[0].anoInicio, max: artigos[0].anoInicio },
  );

  return (
    <>
      <Hero
        destaque={artigos[0]}
        stats={{
          artigos: artigos.length,
          periodos: getPeriodosComConteudo().size,
          anos: anos.max - anos.min,
        }}
        config={config}
      />
      <RecentArticlesGrid artigos={artigos} />
      <TimelinePreview artigos={artigos} />
      <SeriesPreview series={series} />
      <Newsletter
        titulo={config.newsletterTitulo}
        corpo={config.newsletterCorpo}
      />
    </>
  );
}
