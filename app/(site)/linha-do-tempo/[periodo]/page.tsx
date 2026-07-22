import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AcervoCard } from "@/components/acervo/AcervoCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { getArtigoBySlug } from "@/lib/artigos";
import { getAcervoPorSlug } from "@/lib/acervo";
import { getConteudoPorPeriodo } from "@/lib/timeline";
import { PERIODOS, isPeriodoId, type PeriodoId } from "@/data/periodos";

export function generateStaticParams() {
  return PERIODOS.map((p) => ({ periodo: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ periodo: string }>;
}): Promise<Metadata> {
  const { periodo } = await params;
  if (!isPeriodoId(periodo)) return {};
  const label = PERIODOS.find((p) => p.id === periodo)?.label;
  return { title: `${label} — Linha do Tempo — André Bueno` };
}

export default async function LinhaDoTempoPeriodoPage({
  params,
}: {
  params: Promise<{ periodo: string }>;
}) {
  const { periodo: periodoParam } = await params;

  if (!isPeriodoId(periodoParam)) notFound();

  const periodoId: PeriodoId = periodoParam;
  const periodo = PERIODOS.find((p) => p.id === periodoId)!;
  const itens = getConteudoPorPeriodo(periodoId);

  return (
    <Section>
      <Container>
        <VoltarButton fallbackHref="/linha-do-tempo" />

        <div className="mb-12 mt-3">
          <p className="meta text-lacre">
            {periodo.inicio !== null && periodo.fim !== null
              ? `${periodo.inicio}–${periodo.fim}`
              : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
            {periodo.label}
          </h1>
        </div>

        {itens.length === 0 ? (
          <p className="meta text-chumbo-lt">
            Nenhum conteúdo publicado ainda nesta era — em pesquisa.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => {
              if (item.tipo === "artigo") {
                const artigo = getArtigoBySlug(item.slug);
                if (!artigo) return null;
                return (
                  <ArticleCard
                    key={item.url}
                    titulo={artigo.titulo}
                    excerpt={artigo.excerpt}
                    periodo={artigo.periodo}
                    href={artigo.url}
                    data={artigo.data}
                    leituraMinutos={artigo.leituraMinutos}
                    imagemCapa={artigo.imagemCapa}
                  />
                );
              }

              const doc = getAcervoPorSlug(item.slug);
              if (!doc) return null;
              return (
                <AcervoCard
                  key={item.url}
                  titulo={doc.titulo}
                  excerpt={doc.excerpt}
                  periodo={doc.periodo}
                  href={doc.url}
                  imagemCapa={doc.imagemCapa}
                />
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
