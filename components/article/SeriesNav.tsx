import Link from "next/link";
import type { Serie } from "@/lib/artigos";
import { SeguirSerieButton } from "@/components/article/SeguirSerieButton";

export function SeriesNav({
  serie,
  slugAtual,
}: {
  serie: Serie;
  slugAtual: string;
}) {
  const indice = serie.artigos.findIndex((a) => a.slug === slugAtual);
  const anterior = indice > 0 ? serie.artigos[indice - 1] : null;
  const proximo =
    indice >= 0 && indice < serie.artigos.length - 1
      ? serie.artigos[indice + 1]
      : null;

  return (
    <div className="border-y border-borda py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="meta text-chumbo-lt">
          {serie.nome} · parte {indice + 1} de {serie.artigos.length}
        </p>
        <SeguirSerieButton serieSlug={serie.slug} />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {anterior ? (
          <Link href={anterior.url} className="group max-w-sm">
            <span className="meta text-chumbo-lt">← Parte anterior</span>
            <p className="mt-1 font-display text-lg text-ink group-hover:text-lacre">
              {anterior.titulo}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {proximo && (
          <Link href={proximo.url} className="group max-w-sm text-right">
            <span className="meta text-chumbo-lt">Próxima parte →</span>
            <p className="mt-1 font-display text-lg text-ink group-hover:text-lacre">
              {proximo.titulo}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
