import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSobreConfig } from "@/lib/sobre";
import { getIdentidadeConfig } from "@/lib/identidade";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "O Historiador — André Bueno",
  description:
    "Quem é André Bueno e por que este acervo de história do Brasil existe.",
};

// Texto_longo do painel pode vir com parágrafos separados por linha em
// branco — renderiza cada um como <p>, ignorando linhas vazias.
function paragrafos(texto: string) {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function SobrePage() {
  const [sobre, identidade] = await Promise.all([
    getSobreConfig(),
    getIdentidadeConfig(),
  ]);

  const temTrajetoria = Boolean(sobre.trajetoria.trim());
  const temMetodologia = Boolean(sobre.metodologia.trim());

  return (
    <>
      <JsonLd data={personSchema()} />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {sobre.fotoUrl && (
                <div className="relative mb-8 aspect-[4/5] w-full max-w-xs overflow-hidden border border-borda bg-paper-mid">
                  <Image
                    src={sobre.fotoUrl}
                    alt={identidade.nome}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              )}
              <p className="meta text-lacre">O Historiador</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
                {identidade.nome}
              </h1>
              <p className="mt-4 font-serif text-lg text-chumbo">
                {identidade.tagline}
              </p>
              {sobre.emailContato && (
                <a
                  href={`mailto:${sobre.emailContato}`}
                  className="meta mt-6 inline-block text-lacre underline-offset-4 hover:underline"
                >
                  {sobre.emailContato}
                </a>
              )}
            </div>

            <div className="max-w-prose">
              <div className="prose-artigo">
                {paragrafos(sobre.manifesto).map((p, i) => (
                  <p key={i} className="mb-6">
                    {p}
                  </p>
                ))}
              </div>

              {temTrajetoria && (
                <div className="mt-14">
                  <h2 className="font-display text-2xl text-ink md:text-3xl">
                    Trajetória
                  </h2>
                  <div className="prose-artigo mt-5">
                    {paragrafos(sobre.trajetoria).map((p, i) => (
                      <p key={i} className="mb-5">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {temMetodologia && (
                <div className="mt-14">
                  <h2 className="font-display text-2xl text-ink md:text-3xl">
                    Como pesquiso e escrevo
                  </h2>
                  <div className="prose-artigo mt-5">
                    {paragrafos(sobre.metodologia).map((p, i) => (
                      <p key={i} className="mb-5">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
