import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import {
  getDestinoPorSlug,
  getArtigoSlugsVinculadosAoDestino,
} from "@/lib/destinos";
import { getArtigoBySlug } from "@/lib/artigos";
import { formatarData } from "@/lib/format";
import { destinoSchema } from "@/lib/schema";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destino = await getDestinoPorSlug(slug);
  if (!destino) return {};

  return {
    title: `${destino.nome} — André Bueno`,
    description: `${destino.nome}, ${destino.cidade}.`,
  };
}

export default async function DestinoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destino = await getDestinoPorSlug(slug);

  if (!destino) notFound();

  const artigosSlugsVinculados = await getArtigoSlugsVinculadosAoDestino(
    destino.id,
  );
  const artigosVinculados = artigosSlugsVinculados
    .map((s) => getArtigoBySlug(s))
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <Section>
      <JsonLd data={destinoSchema(destino)} />
      <Container className="max-w-3xl">
        <VoltarButton fallbackHref="/destinos" className="mb-8" />

        {destino.foto && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden border border-borda bg-paper-mid">
            <Image src={destino.foto} alt={destino.nome} fill className="object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/destinos/tipo/${encodeURIComponent(destino.tipologia)}`}
            className="meta border border-lacre px-2 py-1 text-lacre hover:bg-lacre hover:text-ouro"
          >
            {destino.tipologia}
          </Link>
          <Link
            href={`/destinos/cidade/${encodeURIComponent(destino.cidade)}`}
            className="meta text-chumbo-lt hover:text-lacre"
          >
            {destino.cidade}
          </Link>
        </div>

        <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
          {destino.nome}
        </h1>

        {destino.textoAutoral && (
          <div className="prose-artigo mt-6">
            <p>{destino.textoAutoral}</p>
          </div>
        )}

        <dl className="mt-10 grid gap-6 border-t border-borda pt-8 sm:grid-cols-2">
          <div>
            <dt className="meta text-chumbo-lt">Endereço</dt>
            <dd className="mt-1 font-serif text-ink">{destino.endereco}</dd>
          </div>
          <div>
            <dt className="meta text-chumbo-lt">Horário</dt>
            <dd className="mt-1 font-serif text-ink">{destino.horario}</dd>
          </div>
          <div>
            <dt className="meta text-chumbo-lt">Ingresso</dt>
            <dd className="mt-1 font-serif text-ink">{destino.ingresso}</dd>
          </div>
          {destino.telefone && (
            <div>
              <dt className="meta text-chumbo-lt">Telefone</dt>
              <dd className="mt-1 font-serif text-ink">{destino.telefone}</dd>
            </div>
          )}
        </dl>

        {destino.site && (
          <a
            href={destino.site}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre"
          >
            <span className="meta text-ouro">Site oficial</span>
          </a>
        )}

        <div className="mt-8 border-t border-borda pt-6">
          <p className="meta text-chumbo-lt">
            Dados verificados em {formatarData(destino.dataVerificacao)}. O
            site oficial do lugar é a fonte definitiva para horário e
            ingresso.
          </p>
        </div>

        {artigosVinculados.length > 0 && (
          <div className="mt-16 border-t border-borda pt-10">
            <p className="meta mb-6 text-chumbo-lt">Artigos relacionados</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {artigosVinculados.map((artigo) => (
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
          </div>
        )}
      </Container>
    </Section>
  );
}
