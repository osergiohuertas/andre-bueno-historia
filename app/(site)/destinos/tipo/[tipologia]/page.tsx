import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DestinoCard } from "@/components/destinos/DestinoCard";
import { DestinoTabs } from "@/components/destinos/DestinoTabs";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getDestinosPorTipologia, getTipologiasComDestinos } from "@/lib/destinos";

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
  const tipologiaDecodificada = decodeURIComponent(tipologia);
  const [destinos, tipologias] = await Promise.all([
    getDestinosPorTipologia(tipologiaDecodificada),
    getTipologiasComDestinos(),
  ]);

  if (destinos.length === 0) notFound();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/destinos" className="mb-4" />
          <p className="meta text-lacre">Destinos</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {tipologiaDecodificada}
          </h1>
        </div>

        <DestinoTabs tipologias={tipologias} ativa={tipologiaDecodificada} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinos.map((destino) => (
            <DestinoCard key={destino.slug} destino={destino} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
