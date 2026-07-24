import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioDestino } from "@/components/painel/FormularioDestino";
import { VinculosArtigosDestino } from "@/components/painel/VinculosArtigosDestino";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarDestino,
  apagarDestino,
} from "@/app/painel/(protegido)/destinos/actions";
import { getArtigosPublicados } from "@/lib/artigos";

export default async function EditarDestinoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: destino }, { data: vinculos }] = await Promise.all([
    supabase.from("destinos").select("*").eq("id", id).single(),
    supabase.from("destino_artigos").select("artigo_slug").eq("destino_id", id),
  ]);

  if (!destino) notFound();

  const artigos = getArtigosPublicados().map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/destinos"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Destinos
        </Link>
        <ConfirmarExclusao action={apagarDestino.bind(null, id)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{destino.nome}</h1>

      <FormularioDestino
        destino={destino}
        action={atualizarDestino.bind(null, id)}
      />

      <div className="mt-16 border-t border-borda pt-10">
        <p className="meta mb-1 text-lacre">Camada 3</p>
        <h2 className="font-display text-xl text-ink">Artigos vinculados</h2>
        <p className="mt-2 mb-6 font-serif text-sm text-chumbo-lt">
          Marque os artigos que têm relação direta com este destino — eles
          aparecem na ficha pública dele.
        </p>
        <VinculosArtigosDestino
          destinoId={destino.id}
          artigos={artigos}
          vinculadosIniciais={(vinculos ?? []).map((v) => v.artigo_slug)}
        />
      </div>
    </div>
  );
}
