import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListaFiltrada } from "@/components/artigos/ListaFiltrada";
import { getArtigosPorTag, getTagsComConteudo } from "@/lib/artigos";

export function generateStaticParams() {
  return getTagsComConteudo().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `${decodeURIComponent(tag)} — André Bueno` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const artigos = getArtigosPorTag(decodeURIComponent(tag));
  if (artigos.length === 0) notFound();

  return (
    <ListaFiltrada
      eyebrow="Tema"
      titulo={decodeURIComponent(tag)}
      artigos={artigos}
    />
  );
}
