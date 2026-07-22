import type { Metadata } from "next";
import { PaginaEventosFiltrada } from "@/components/eventos/PaginaEventosFiltrada";
import { getEventosFuturos } from "@/lib/eventos";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventos culturais — André Bueno",
  description: "Eventos de natureza cultural na agenda de André Bueno.",
};

export default async function EventosCulturaisPage() {
  const eventos = await getEventosFuturos({ natureza: "cultural" });

  return (
    <PaginaEventosFiltrada
      eyebrow="Agenda"
      titulo="Eventos culturais"
      descricao="Lançamentos, feiras, mesas-redondas e eventos de divulgação histórica."
      eventos={eventos}
    />
  );
}
