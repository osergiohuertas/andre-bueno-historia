import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioEvento } from "@/components/painel/FormularioEvento";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarEvento,
  apagarEvento,
} from "@/app/painel/(protegido)/agenda/actions";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: evento } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", id)
    .single();

  if (!evento) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/agenda"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Agenda
        </Link>
        <ConfirmarExclusao action={apagarEvento.bind(null, id)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{evento.titulo}</h1>

      <FormularioEvento evento={evento} action={atualizarEvento.bind(null, id)} />
    </div>
  );
}
