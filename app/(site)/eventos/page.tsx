import type { Metadata } from "next";
import { PaginaEventosFiltrada } from "@/components/eventos/PaginaEventosFiltrada";
import { getEventosFuturos } from "@/lib/eventos";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Agenda — André Bueno",
  description: "Eventos culturais e acadêmicos, com curadoria ou participação direta de André Bueno.",
};

export default async function EventosPage() {
  const eventos = await getEventosFuturos();

  return (
    <PaginaEventosFiltrada
      eyebrow="Agenda"
      titulo="Eventos"
      descricao="Eventos culturais e acadêmicos com curadoria de André Bueno ou participação direta dele. A inscrição é sempre feita com o organizador — a plataforma não processa nada aqui."
      eventos={eventos}
    />
  );
}
