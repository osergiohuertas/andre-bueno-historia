import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AlternadorVisualizacao } from "@/components/eventos/AlternadorVisualizacao";
import { VoltarButton } from "@/components/ui/VoltarButton";
import type { Evento } from "@/lib/eventos";

export function PaginaEventosFiltrada({
  eyebrow,
  titulo,
  descricao,
  eventos,
}: {
  eyebrow: string;
  titulo: string;
  descricao: string;
  eventos: Evento[];
}) {
  return (
    <Section>
      <Container>
        <div className="mb-12">
          <VoltarButton fallbackHref="/eventos" className="mb-4" />
          <p className="meta text-lacre">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {titulo}
          </h1>
          <p className="mt-4 max-w-prose font-serif text-chumbo">
            {descricao}
          </p>
        </div>

        <AlternadorVisualizacao eventos={eventos} />
      </Container>
    </Section>
  );
}
