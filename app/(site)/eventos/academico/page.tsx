import type { Metadata } from "next";
import { PaginaEventosFiltrada } from "@/components/eventos/PaginaEventosFiltrada";
import { getEventosFuturos } from "@/lib/eventos";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventos acadêmicos — André Bueno",
  description: "Eventos de natureza acadêmica na agenda de André Bueno.",
};

export default async function EventosAcademicosPage() {
  const eventos = await getEventosFuturos({ natureza: "academico" });

  return (
    <PaginaEventosFiltrada
      eyebrow="Agenda"
      titulo="Eventos acadêmicos"
      descricao="Congressos, simpósios, seminários e bancas na agenda de André Bueno."
      eventos={eventos}
    />
  );
}
