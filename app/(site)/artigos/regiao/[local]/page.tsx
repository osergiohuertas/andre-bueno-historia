import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListaFiltrada } from "@/components/artigos/ListaFiltrada";
import { getArtigosPorRegiao, getRegioesComConteudo } from "@/lib/artigos";

export function generateStaticParams() {
  return getRegioesComConteudo().map((local) => ({ local }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ local: string }>;
}): Promise<Metadata> {
  const { local } = await params;
  return { title: `${decodeURIComponent(local)} — André Bueno` };
}

export default async function RegiaoPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const artigos = getArtigosPorRegiao(decodeURIComponent(local));
  if (artigos.length === 0) notFound();

  return (
    <ListaFiltrada
      eyebrow="Região"
      titulo={decodeURIComponent(local)}
      artigos={artigos}
    />
  );
}
