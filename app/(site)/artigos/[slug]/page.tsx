import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PeriodoBadge } from "@/components/ui/PeriodoBadge";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { PeriodAxis } from "@/components/article/PeriodAxis";
import { TableOfContents } from "@/components/article/TableOfContents";
import { SeriesNav } from "@/components/article/SeriesNav";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { CardConexaoLivro } from "@/components/article/CardConexaoLivro";
import { JsonLd } from "@/components/seo/JsonLd";
import { AcoesBiblioteca } from "@/components/article/AcoesBiblioteca";
import {
  getArtigoBySlug,
  getArtigosPublicados,
  getArtigosRelacionados,
  getSeriePorSlug,
} from "@/lib/artigos";
import { formatarData } from "@/lib/format";
import { getLivroConfig } from "@/lib/livro";
import { articleSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getArtigosPublicados().map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = getArtigoBySlug(slug);
  if (!artigo) return {};

  return {
    title: `${artigo.titulo} — André Bueno`,
    description: artigo.excerpt,
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = getArtigoBySlug(slug);
  if (!artigo) notFound();

  const relacionados = getArtigosRelacionados(artigo);
  const serie = artigo.serie ? await getSeriePorSlug(artigo.serie) : undefined;
  const livro = artigo.conexaoLivro ? await getLivroConfig() : null;

  return (
    <>
      <JsonLd data={articleSchema(artigo)} />
      <ReadingProgress targetId="conteudo-artigo" />

      <article id="conteudo-artigo">
        <Container className="py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[80px_1fr_200px]">
            <PeriodAxis periodo={artigo.periodo} />

            <div className="mx-auto w-full max-w-prose">
              <VoltarButton fallbackHref="/artigos" className="mb-8" />

              <header className="mb-12">
                <PeriodoBadge periodo={artigo.periodo} />
                <h1 className="mt-5 font-display text-4xl leading-tight text-ink md:text-5xl">
                  {artigo.titulo}
                </h1>
                {artigo.subtitulo && (
                  <p className="mt-4 font-serif text-xl text-chumbo italic">
                    {artigo.subtitulo}
                  </p>
                )}
                <div className="meta mt-6 flex flex-wrap gap-x-4 gap-y-2 text-chumbo-lt">
                  <span>{formatarData(artigo.data)}</span>
                  <span aria-hidden>·</span>
                  <span>{artigo.leituraMinutos} min de leitura</span>
                  {artigo.regiao && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{artigo.regiao}</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <AcoesBiblioteca artigoSlug={artigo.slug} />
                </div>
              </header>

              <MDXContent code={artigo.body} />

              {artigo.conexaoLivro && livro && (
                <CardConexaoLivro
                  nota={artigo.conexaoLivro}
                  tituloLivro={livro.titulo}
                />
              )}
            </div>

            <TableOfContents toc={artigo.toc} />
          </div>
        </Container>

        <Container>
          <div className="mx-auto flex w-full max-w-prose flex-col gap-16 pb-16">
            {serie && <SeriesNav serie={serie} slugAtual={artigo.slug} />}
          </div>
        </Container>

        <RelatedArticles artigos={relacionados} />
      </article>
    </>
  );
}
