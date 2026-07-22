import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { CapaTilt } from "@/components/livro/CapaTilt";
import { AmazonCTA } from "@/components/livro/AmazonCTA";
import { PDFViewer } from "@/components/acervo/PDFViewer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLivroConfig } from "@/lib/livro";
import { getArtigosConectadosAoLivro } from "@/lib/artigos";
import { bookSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const livro = await getLivroConfig();
  return {
    title: `${livro.titulo} — André Bueno`,
    description: livro.subtitulo,
  };
}

const ALGARISMOS_ROMANOS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
] as const;

export default async function LivroPage() {
  const livro = await getLivroConfig();
  const artigosConectados = getArtigosConectadosAoLivro();

  const temAmostra = Boolean(livro.amostraPdfUrl);
  const temKindle = Boolean(
    livro.amazonUrlKindle &&
      !livro.amazonUrlKindle.toUpperCase().includes("PLACEHOLDER"),
  );

  // Três revelações mais curtas servem de selo de credibilidade logo na
  // abertura — mesmo dado das "Revelações" mais abaixo, só reaproveitado
  // como resumo visual antes do leitor rolar a página.
  const selos = [
    livro.revelacoes[2],
    livro.revelacoes[3],
    livro.revelacoes[4],
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={bookSchema(livro)} />

      <Section className="py-16 md:py-24">
        <Container className="grid gap-16 md:grid-cols-2 md:items-center">
          <Reveal>
            <CapaTilt titulo={livro.titulo} capa={livro.capaUrl} />
          </Reveal>

          <Reveal>
            <p className="meta text-lacre">O livro</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              {livro.titulo}
            </h1>
            <p className="mt-4 font-serif text-xl italic text-chumbo">
              {livro.subtitulo}
            </p>

            <blockquote className="mt-8 border-l-2 border-lacre pl-6 font-serif text-lg leading-relaxed text-chumbo">
              “{livro.argumento}”
            </blockquote>

            {selos.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {selos.map((selo) => (
                  <li
                    key={selo.titulo}
                    className="meta border border-borda px-3 py-1.5 text-chumbo-lt"
                  >
                    {selo.titulo}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <AmazonCTA
                url={livro.amazonUrlFisico}
                tagAfiliado={livro.amazonTagAfiliado}
              />
              {temAmostra && (
                <a
                  href="#amostra"
                  className="group meta flex items-center gap-2 text-chumbo transition-colors hover:text-lacre"
                >
                  Ler uma amostra
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper-mid">
        <Container className="mx-auto max-w-prose">
          <Reveal>
            <p className="meta text-lacre">Sobre o livro</p>
            <div className="prose-artigo mt-6 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-lacre">
              <p>{livro.sobre}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="mb-14">
            <p className="meta text-lacre">O que você vai encontrar</p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              Revelações
            </h2>
          </Reveal>

          <Reveal className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {livro.revelacoes.map((revelacao, i) => (
              <div key={revelacao.titulo} className="flex gap-6">
                <span className="w-12 shrink-0 text-right font-display text-3xl font-black leading-none text-borda">
                  {ALGARISMOS_ROMANOS[i] ?? i + 1}
                </span>
                <div className="border-t border-borda pt-4">
                  <h3 className="font-display text-lg text-ink">
                    {revelacao.titulo}
                  </h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-chumbo">
                    {revelacao.descricao}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {temAmostra && (
        <Section id="amostra" tone="paper-mid" className="scroll-mt-24">
          <Container className="mx-auto max-w-prose">
            <Reveal className="mb-8">
              <p className="meta text-lacre">Antes de decidir</p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Leia as primeiras páginas
              </h2>
            </Reveal>
            <Reveal>
              <PDFViewer url={livro.amostraPdfUrl as string} titulo={livro.titulo} />
            </Reveal>
          </Container>
        </Section>
      )}

      <Section tone="ink" className="text-center">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-paper">
              Leve {livro.titulo} para casa.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <AmazonCTA
                url={livro.amazonUrlFisico}
                tagAfiliado={livro.amazonTagAfiliado}
                tom="escuro"
              />
              {temKindle && (
                <AmazonCTA
                  url={livro.amazonUrlKindle}
                  tagAfiliado={livro.amazonTagAfiliado}
                  tom="escuro"
                  label="Versão Kindle"
                />
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      {artigosConectados.length > 0 && (
        <Section tone="paper-mid">
          <Container>
            <p className="meta mb-8 text-chumbo-lt">
              Artigos conectados ao livro
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {artigosConectados.map((artigo) => (
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
      )}
    </>
  );
}
