import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PeriodoBadge } from "@/components/ui/PeriodoBadge";
import { VoltarButton } from "@/components/ui/VoltarButton";
import { MDXContent } from "@/components/mdx/MDXContent";
import { PDFViewer } from "@/components/acervo/PDFViewer";
import { getAcervoPorSlug, getAcervoPublicado } from "@/lib/acervo";
import { formatarData } from "@/lib/format";

export function generateStaticParams() {
  return getAcervoPublicado().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getAcervoPorSlug(slug);
  if (!item) return {};

  return {
    title: `${item.titulo} — André Bueno`,
    description: item.excerpt,
  };
}

export default async function AcervoDocumentoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getAcervoPorSlug(slug);

  if (!item) notFound();

  return (
    <Section>
      <Container className="max-w-3xl">
        <VoltarButton fallbackHref="/acervo" className="mb-8" />

        {item.imagemCapa && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden border border-borda bg-paper-mid">
            <Image
              src={item.imagemCapa}
              alt={item.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <PeriodoBadge periodo={item.periodo} className="w-fit" />

        <h1 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
          {item.titulo}
        </h1>

        <p className="mt-3 meta text-chumbo-lt">
          {item.anoInicio}
          {item.anoFim ? `–${item.anoFim}` : ""}
          {item.regiao ? ` · ${item.regiao}` : ""}
          {" · "}
          {formatarData(item.data)}
        </p>

        {item.fonte && (
          <p className="mt-1 meta text-chumbo-lt">Fonte: {item.fonte}</p>
        )}

        <div className="mt-10">
          <PDFViewer url={item.pdfUrl} titulo={item.titulo} />
        </div>

        <div className="mt-12 border-t border-borda pt-10">
          <p className="meta mb-6 text-lacre">Anotação</p>
          <MDXContent code={item.body} />
        </div>
      </Container>
    </Section>
  );
}
