import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Filtros } from "@/components/artigos/Filtros";
import {
  filtrarArtigos,
  getRegioesComConteudo,
  getTagsComConteudo,
} from "@/lib/artigos";
import type { PeriodoId } from "@/data/periodos";

export const metadata: Metadata = {
  title: "Artigos — André Bueno",
  description: "Todos os artigos, filtráveis por período, região e tema.",
};

export default async function ArtigosPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; regiao?: string; tag?: string }>;
}) {
  const params = await searchParams;

  const artigos = filtrarArtigos({
    periodo: params.periodo as PeriodoId | undefined,
    regiao: params.regiao,
    tag: params.tag,
  });

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <p className="meta text-lacre">Acervo editorial</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Artigos
          </h1>
        </div>

        <div className="mb-12">
          <Filtros
            ativos={params}
            regioes={getRegioesComConteudo()}
            tags={getTagsComConteudo()}
          />
        </div>

        {artigos.length === 0 ? (
          <p className="meta text-chumbo-lt">
            Nenhum artigo encontrado com esses filtros.
          </p>
        ) : (
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
        )}
      </Container>
    </Section>
  );
}
