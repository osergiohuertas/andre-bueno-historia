import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioArtigo } from "@/components/painel/FormularioArtigo";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarArtigoAction,
  apagarArtigoAction,
} from "@/app/painel/(protegido)/artigos/actions";
import { contarArtigosPorPeriodo } from "@/lib/artigos";
import { lerArtigoMdxBruto } from "@/lib/artigoAdmin";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = lerArtigoMdxBruto(slug);

  if (!artigo) notFound();

  const supabase = await createClient();
  const { data: series } = await supabase
    .from("series")
    .select("slug, nome")
    .order("ordem", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/artigos"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Artigos
        </Link>
        <ConfirmarExclusao action={apagarArtigoAction.bind(null, slug)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{artigo.titulo}</h1>

      <FormularioArtigo
        artigo={{ slug, ...artigo }}
        series={series ?? []}
        contagens={contarArtigosPorPeriodo()}
        action={atualizarArtigoAction.bind(null, slug)}
      />
    </div>
  );
}
