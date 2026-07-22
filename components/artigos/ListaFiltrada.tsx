import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import type { Artigo } from "@/lib/artigos";

export function ListaFiltrada({
  eyebrow,
  titulo,
  artigos,
}: {
  eyebrow: string;
  titulo: string;
  artigos: Artigo[];
}) {
  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/artigos" className="mb-4" />
          <p className="meta text-lacre">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {titulo}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
