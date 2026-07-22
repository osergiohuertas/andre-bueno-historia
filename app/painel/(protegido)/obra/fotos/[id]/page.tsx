import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioMidia } from "@/components/painel/FormularioMidia";
import { atualizarMidia } from "@/app/painel/(protegido)/obra/midia-actions";

export default async function EditarFotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: foto } = await supabase
    .from("acervo_midia")
    .select("*")
    .eq("id", id)
    .eq("tipo", "foto")
    .single();

  if (!foto) notFound();

  return (
    <div>
      <Link
        href="/painel/obra/fotos"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Fotos
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">{foto.titulo}</h1>

      <FormularioMidia
        tipo="foto"
        midia={foto}
        action={atualizarMidia.bind(null, id, "foto")}
      />
    </div>
  );
}
