import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioMuseu } from "@/components/painel/FormularioMuseu";
import { VinculosArtigosMuseu } from "@/components/painel/VinculosArtigosMuseu";
import { atualizarMuseu } from "@/app/painel/(protegido)/museus/actions";
import { getArtigosPublicados } from "@/lib/artigos";

export default async function EditarMuseuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: museu }, { data: vinculos }] = await Promise.all([
    supabase.from("museus").select("*").eq("id", id).single(),
    supabase.from("museu_artigos").select("artigo_slug").eq("museu_id", id),
  ]);

  if (!museu) notFound();

  const artigos = getArtigosPublicados().map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
  }));

  return (
    <div>
      <Link href="/painel/museus" className="meta text-chumbo hover:text-lacre">
        ← Museus
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">{museu.nome}</h1>

      <FormularioMuseu museu={museu} action={atualizarMuseu.bind(null, id)} />

      <div className="mt-16 border-t border-borda pt-10">
        <p className="meta mb-1 text-lacre">Camada 3</p>
        <h2 className="font-display text-xl text-ink">Artigos vinculados</h2>
        <p className="mt-2 mb-6 font-serif text-sm text-chumbo-lt">
          Marque os artigos que têm relação direta com este museu — eles
          aparecem na ficha pública dele.
        </p>
        <VinculosArtigosMuseu
          museuId={museu.id}
          artigos={artigos}
          vinculadosIniciais={(vinculos ?? []).map((v) => v.artigo_slug)}
        />
      </div>
    </div>
  );
}
