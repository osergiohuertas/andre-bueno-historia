import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListaFiltrada } from "@/components/artigos/ListaFiltrada";
import { getPeriodo, isPeriodoId } from "@/data/periodos";
import { getArtigosPorPeriodo, getPeriodosComConteudo } from "@/lib/artigos";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from(getPeriodosComConteudo()).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isPeriodoId(id)) return {};
  return { title: `${getPeriodo(id).label} — André Bueno` };
}

export default async function PeriodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isPeriodoId(id) || !getPeriodosComConteudo().has(id)) notFound();

  return (
    <ListaFiltrada
      eyebrow="Período"
      titulo={getPeriodo(id).label}
      artigos={getArtigosPorPeriodo(id)}
    />
  );
}
