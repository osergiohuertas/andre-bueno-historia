import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioSerie } from "@/components/painel/FormularioSerie";
import { atualizarSerie } from "@/app/painel/(protegido)/series/actions";

export default async function EditarSeriePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: serie } = await supabase
    .from("series")
    .select("*")
    .eq("id", id)
    .single();

  if (!serie) notFound();

  return (
    <div>
      <Link href="/painel/series" className="meta text-chumbo hover:text-lacre">
        ← Séries
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">{serie.nome}</h1>

      <FormularioSerie serie={serie} action={atualizarSerie.bind(null, id)} />
    </div>
  );
}
