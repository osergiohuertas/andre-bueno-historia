import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import type { Artigo } from "@/lib/artigos";

export function RecentArticlesGrid({ artigos }: { artigos: Artigo[] }) {
  if (artigos.length === 0) return null;

  const [primeiro, ...resto] = artigos.slice(0, 5);

  return (
    <Section className="!py-0 pb-32 md:pb-44">
      <Reveal className="flex items-center gap-6 px-6 pb-10 pt-16 md:px-10 md:pt-24">
        <span className="meta whitespace-nowrap text-chumbo-lt">
          Artigos recentes
        </span>
        <span className="section-divider-line" aria-hidden />
        <Link
          href="/artigos"
          className="meta whitespace-nowrap text-chumbo-lt transition-colors hover:text-lacre"
        >
          Ver todos →
        </Link>
      </Reveal>

      <Container>
        <Reveal className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          <ArticleCard
            titulo={primeiro.titulo}
            excerpt={primeiro.excerpt}
            periodo={primeiro.periodo}
            href={primeiro.url}
            data={primeiro.data}
            leituraMinutos={primeiro.leituraMinutos}
            imagemCapa={primeiro.imagemCapa}
            variant="highlight"
          />

          {resto.map((artigo) => (
            <ArticleCard
              key={artigo.slug}
              titulo={artigo.titulo}
              excerpt={artigo.excerpt}
              periodo={artigo.periodo}
              href={artigo.url}
              data={artigo.data}
              leituraMinutos={artigo.leituraMinutos}
              imagemCapa={artigo.imagemCapa}
            />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
