import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getPublicacaoPorSlug, type Publicacao } from "@/lib/obra";

export const revalidate = 3600;

const LABEL_TIPO: Record<Publicacao["tipo"], string> = {
  livro: "Livro",
  artigo_academico: "Artigo acadêmico",
  capitulo: "Capítulo",
  ensaio: "Ensaio",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publicacao = await getPublicacaoPorSlug(slug);
  if (!publicacao) return {};

  return {
    title: `${publicacao.titulo} — André Bueno`,
    description: publicacao.resumo ?? `${publicacao.veiculo}, ${publicacao.ano}.`,
  };
}

export default async function PublicacaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publicacao = await getPublicacaoPorSlug(slug);

  if (!publicacao) notFound();

  return (
    <Section>
      <Container className="max-w-3xl">
        <VoltarButton fallbackHref="/acervo?secao=publicacoes" className="mb-8" />

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden border border-borda bg-paper-mid md:w-56">
            {publicacao.capa ? (
              <Image
                src={publicacao.capa}
                alt={publicacao.titulo}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-4xl text-borda">
                  {publicacao.ano}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <p className="meta text-lacre">{LABEL_TIPO[publicacao.tipo]}</p>
            <h1 className="font-display text-3xl leading-tight text-ink md:text-4xl">
              {publicacao.titulo}
            </h1>
            <p className="meta text-chumbo-lt">
              {publicacao.veiculo} · {publicacao.ano}
              {publicacao.coautores ? ` · com ${publicacao.coautores}` : ""}
            </p>

            {publicacao.resumo && (
              <p className="mt-2 font-serif text-[17px] leading-relaxed text-chumbo">
                {publicacao.resumo}
              </p>
            )}

            {publicacao.link && (
              <a
                href={publicacao.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-2 border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre"
              >
                <span className="meta text-ouro">
                  Ver fonte — publicação original ↗
                </span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
