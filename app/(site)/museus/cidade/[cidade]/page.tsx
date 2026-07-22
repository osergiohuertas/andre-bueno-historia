import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MuseuCard } from "@/components/museus/MuseuCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getMuseusPorCidade } from "@/lib/museus";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cidade: string }>;
}): Promise<Metadata> {
  const { cidade } = await params;
  return {
    title: `Museus em ${decodeURIComponent(cidade)} — André Bueno`,
  };
}

export default async function MuseusPorCidadePage({
  params,
}: {
  params: Promise<{ cidade: string }>;
}) {
  const { cidade } = await params;
  const museus = await getMuseusPorCidade(decodeURIComponent(cidade));

  if (museus.length === 0) notFound();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/museus" className="mb-4" />
          <p className="meta text-lacre">Museus</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {decodeURIComponent(cidade)}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {museus.map((museu) => (
            <MuseuCard key={museu.slug} museu={museu} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
