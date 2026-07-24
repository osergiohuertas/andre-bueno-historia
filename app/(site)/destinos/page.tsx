import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DestinoCard } from "@/components/destinos/DestinoCard";
import { getDestinos } from "@/lib/destinos";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Destinos — André Bueno",
  description: "Museus, patrimônio cultural e lugares de relevância histórica.",
};

export default async function DestinosPage() {
  const destinos = await getDestinos();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <p className="meta text-lacre">Autoridade</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Destinos
          </h1>
          <p className="mt-4 max-w-prose font-serif text-chumbo">
            O André não é autoridade sobre horário de funcionamento — o
            site oficial de cada lugar é a fonte definitiva. Somos
            autoridade sobre relevância histórica.
          </p>
        </div>

        {destinos.length === 0 ? (
          <p className="meta text-chumbo-lt">Nenhum destino cadastrado ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinos.map((destino) => (
              <DestinoCard key={destino.slug} destino={destino} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
