import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MuseuCard } from "@/components/museus/MuseuCard";
import { getMuseus } from "@/lib/museus";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Museus — André Bueno",
  description: "Catálogo de museus de relevância histórica.",
};

export default async function MuseusPage() {
  const museus = await getMuseus();

  return (
    <Section>
      <Container>
        <div className="mb-12">
          <p className="meta text-lacre">Autoridade</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Museus
          </h1>
          <p className="mt-4 max-w-prose font-serif text-chumbo">
            O André não é autoridade sobre horário de funcionamento — o
            site oficial de cada museu é a fonte definitiva. Somos
            autoridade sobre relevância histórica.
          </p>
        </div>

        {museus.length === 0 ? (
          <p className="meta text-chumbo-lt">Nenhum museu cadastrado ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {museus.map((museu) => (
              <MuseuCard key={museu.slug} museu={museu} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
