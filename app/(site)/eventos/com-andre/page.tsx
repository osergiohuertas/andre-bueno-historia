import type { Metadata } from "next";
import { PaginaEventosFiltrada } from "@/components/eventos/PaginaEventosFiltrada";
import { getEventosFuturos } from "@/lib/eventos";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Com André Bueno — André Bueno",
  description: "Eventos com participação direta de André Bueno.",
};

export default async function EventosComAndrePage() {
  const eventos = await getEventosFuturos({ participacao: "com_andre" });

  return (
    <PaginaEventosFiltrada
      eyebrow="Agenda"
      titulo="Com André Bueno"
      descricao="Eventos com participação direta do André — palestra, mesa, banca ou lançamento."
      eventos={eventos}
    />
  );
}
