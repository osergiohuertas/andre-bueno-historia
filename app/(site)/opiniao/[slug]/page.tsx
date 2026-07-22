import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { TableOfContents } from "@/components/article/TableOfContents";
import { SeloOpiniao } from "@/components/opiniao/SeloOpiniao";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getOpiniaoBySlug,
  getOpinioesPublicadas,
  getArtigosDaBaseHistorica,
} from "@/lib/opinioes";
import { getPeriodo } from "@/data/periodos";
import { formatarData } from "@/lib/format";
import { opinionSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getOpinioesPublicadas().map((opiniao) => ({ slug: opiniao.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opiniao = getOpiniaoBySlug(slug);
  if (!opiniao) return {};

  return {
    title: `${opiniao.titulo} — Opinião — André Bueno`,
    description: opiniao.excerpt,
  };
}

export default async function OpiniaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opiniao = getOpiniaoBySlug(slug);
  if (!opiniao) notFound();

  const baseHistorica = getArtigosDaBaseHistorica(opiniao.artigosRelacionados);

  return (
    <>
      <JsonLd data={opinionSchema(opiniao)} />
      <ReadingProgress targetId="conteudo-opiniao" />

      <article id="conteudo-opiniao">
        <Container className="py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_200px]">
            <div className="mx-auto w-full max-w-prose">
              <VoltarButton fallbackHref="/opiniao" className="mb-8" />

              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-3">
                  <SeloOpiniao />
                  {opiniao.periodosRelacionados?.map((p) => (
                    <span key={p} className="meta text-chumbo-lt">
                      {getPeriodo(p).label}
                    </span>
                  ))}
                </div>

                <h1 className="mt-5 font-display text-4xl leading-tight text-ink md:text-5xl">
                  {opiniao.titulo}
                </h1>
                {opiniao.subtitulo && (
                  <p className="mt-4 font-serif text-xl text-chumbo italic">
                    {opiniao.subtitulo}
                  </p>
                )}
                <div className="meta mt-6 flex flex-wrap gap-x-4 gap-y-2 text-chumbo-lt">
                  <span>{formatarData(opiniao.data)}</span>
                  <span aria-hidden>·</span>
                  <span>{opiniao.leituraMinutos} min de leitura</span>
                </div>

                {/* Deixa explícito o que o leitor está lendo: análise, não
                    exposição documentada. É a fronteira entre fato e opinião,
                    dita em palavras, não só no selo. */}
                <p className="mt-6 border-l-2 border-ouro bg-ouro/5 py-3 pl-4 font-serif text-sm leading-relaxed text-chumbo">
                  Este é um artigo de opinião. A análise e as conclusões são do
                  autor — os fatos que a embasam estão nos artigos do acervo.
                </p>
              </header>

              <MDXContent code={opiniao.body} />

              {baseHistorica.length > 0 && (
                <section className="mt-16 border-t border-borda pt-10">
                  <p className="meta text-ouro">Base histórica</p>
                  <p className="mt-2 mb-6 font-serif text-sm text-chumbo">
                    Os artigos documentados que embasam esta análise.
                  </p>
                  <ul className="flex flex-col divide-y divide-borda">
                    {baseHistorica.map((artigo) => (
                      <li key={artigo.slug}>
                        <Link
                          href={artigo.url}
                          className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-lacre"
                        >
                          <span className="font-display text-lg text-ink group-hover:text-lacre">
                            {artigo.titulo}
                          </span>
                          <span className="meta shrink-0 text-chumbo-lt">
                            {getPeriodo(artigo.periodo).label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <TableOfContents toc={opiniao.toc} />
          </div>
        </Container>
      </article>
    </>
  );
}
