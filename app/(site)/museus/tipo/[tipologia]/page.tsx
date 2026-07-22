import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MuseuCard } from "@/components/museus/MuseuCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getMuseusPorTipologia } from "@/lib/museus";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipologia: string }>;
}): Promise<Metadata> {
  const { tipologia } = await params;
  return {
    title: `Museus — ${decodeURIComponent(tipologia)} — André Bueno`,
  };
}

export default async function MuseusPorTipologiaPage({
  params,
}: {
  params: Promise<{ tipologia: string }>;
}) {
  const { tipologia } = await params;
  const museus = await getMuseusPorTipologia(decodeURIComponent(tipologia));

  if (museus.length === 0) notFound();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/museus" className="mb-4" />
          <p className="meta text-lacre">Museus</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {decodeURIComponent(tipologia)}
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
