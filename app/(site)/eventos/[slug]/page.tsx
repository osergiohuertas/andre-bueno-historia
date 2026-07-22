import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SeloEvento } from "@/components/eventos/SeloEvento";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { getEventoPorSlug } from "@/lib/eventos";
import { formatarData } from "@/lib/format";
import { eventSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoPorSlug(slug);
  if (!evento) return {};

  return {
    title: `${evento.titulo} — André Bueno`,
    description: evento.descricao,
  };
}

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await getEventoPorSlug(slug);

  if (!evento) notFound();

  const mesmoDia =
    new Date(evento.dataInicio).toDateString() ===
    new Date(evento.dataFim).toDateString();

  return (
    <Section>
      <JsonLd data={eventSchema(evento)} />
      <Container className="max-w-3xl">
        <VoltarButton fallbackHref="/eventos" className="mb-8" />

        {evento.imagemCapa && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden border border-borda bg-paper-mid">
            <Image
              src={evento.imagemCapa}
              alt={evento.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <SeloEvento
          natureza={evento.natureza}
          participacao={evento.participacao}
        />

        <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
          {evento.titulo}
        </h1>

        <p className="mt-3 meta text-chumbo-lt">
          {mesmoDia
            ? formatarData(evento.dataInicio)
            : `${formatarData(evento.dataInicio)} – ${formatarData(evento.dataFim)}`}
          {" · "}
          {evento.local}, {evento.cidade}
        </p>

        <div className="prose-artigo mt-8">
          <p>{evento.descricao}</p>
        </div>

        <dl className="mt-10 grid gap-4 border-t border-borda pt-8 sm:grid-cols-2">
          {evento.endereco && (
            <div>
              <dt className="meta text-chumbo-lt">Endereço</dt>
              <dd className="mt-1 font-serif text-ink">{evento.endereco}</dd>
            </div>
          )}
          <div>
            <dt className="meta text-chumbo-lt">Organizador</dt>
            <dd className="mt-1 font-serif text-ink">{evento.organizador}</dd>
          </div>
        </dl>

        {evento.linkInscricao && (
          <a
            href={evento.linkInscricao}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre"
          >
            <span className="meta text-ouro">Inscreva-se com o organizador</span>
          </a>
        )}
      </Container>
    </Section>
  );
}
