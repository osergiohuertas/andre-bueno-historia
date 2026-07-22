import type { Metadata } from "next";
import { PaginaEventosFiltrada } from "@/components/eventos/PaginaEventosFiltrada";
import { getEventosArquivo } from "@/lib/eventos";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Arquivo de eventos — André Bueno",
  description: "Eventos já encerrados da agenda de André Bueno.",
};

export default async function EventosArquivoPage() {
  const eventos = await getEventosArquivo();

  return (
    <PaginaEventosFiltrada
      eyebrow="Agenda"
      titulo="Arquivo"
      descricao="Eventos encerrados. A transição para cá é automática, por data de término — ninguém precisa mover nada."
      eventos={eventos}
    />
  );
}
