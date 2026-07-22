import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { Serie } from "@/lib/artigos";

export function SeriesPreview({ series }: { series: Serie[] }) {
  if (series.length === 0) return null;

  return (
    <Section tone="paper-mid">
      <Container>
        <Reveal className="mb-12">
          <p className="meta text-lacre">Leitura contínua</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            Séries em andamento
          </h2>
        </Reveal>

        <Reveal className="grid gap-6 md:grid-cols-2">
          {series.map((serie) => {
            const primeiroArtigo = serie.artigos[0];
            const partesLabel =
              serie.artigos.length === 1
                ? "1 parte"
                : `${serie.artigos.length} partes`;

            return (
              <Link
                key={serie.slug}
                href={primeiroArtigo.url}
                className="group flex gap-6 border border-borda bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-lacre hover:shadow-[0_4px_24px_-8px_rgba(27,59,143,0.15)]"
              >
                <span className="w-14 shrink-0 text-right font-display text-5xl font-black leading-none text-borda transition-all duration-300 group-hover:scale-105 group-hover:text-lacre">
                  {serie.numero}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-bold leading-snug text-ink">
                    {serie.nome}
                  </h3>
                  {serie.descricao && (
                    <p className="font-serif text-sm font-light leading-relaxed text-chumbo">
                      {serie.descricao}
                    </p>
                  )}
                  <p className="meta mt-1 text-chumbo-lt">{partesLabel}</p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
