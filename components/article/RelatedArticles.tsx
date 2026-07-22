import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Artigo } from "@/lib/artigos";

export function RelatedArticles({ artigos }: { artigos: Artigo[] }) {
  if (artigos.length === 0) return null;

  return (
    <Section tone="paper-mid">
      <Container>
        <p className="meta mb-8 text-chumbo-lt">Continue lendo</p>
        <div className="grid gap-6 md:grid-cols-3">
          {artigos.map((artigo) => (
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
        </div>
      </Container>
    </Section>
  );
}
