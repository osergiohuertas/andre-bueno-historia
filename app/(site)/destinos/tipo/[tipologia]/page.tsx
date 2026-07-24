import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DestinoCard } from "@/components/destinos/DestinoCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getDestinosPorTipologia } from "@/lib/destinos";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipologia: string }>;
}): Promise<Metadata> {
  const { tipologia } = await params;
  return {
    title: `Destinos — ${decodeURIComponent(tipologia)} — André Bueno`,
  };
}

export default async function DestinosPorTipologiaPage({
  params,
}: {
  params: Promise<{ tipologia: string }>;
}) {
  const { tipologia } = await params;
  const destinos = await getDestinosPorTipologia(decodeURIComponent(tipologia));

  if (destinos.length === 0) notFound();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/destinos" className="mb-4" />
          <p className="meta text-lacre">Destinos</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {decodeURIComponent(tipologia)}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinos.map((destino) => (
            <DestinoCard key={destino.slug} destino={destino} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
