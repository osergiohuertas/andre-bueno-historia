import { VerNoSite } from "@/components/painel/VerNoSite";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioArtigo } from "@/components/painel/FormularioArtigo";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarArtigoAction,
  apagarArtigoAction,
} from "@/app/painel/(protegido)/artigos/actions";
import { contarArtigosPorPeriodo } from "@/lib/artigos";
import { lerArtigoMdxBruto } from "@/lib/artigoAdmin";
import { getSessaoPainel } from "@/lib/painel-auth";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = lerArtigoMdxBruto(slug);

  if (!artigo) notFound();

  const sessao = await getSessaoPainel();
  if (sessao?.papel === "colaborador" && artigo.autorId !== sessao.userId) {
    redirect("/painel/artigos");
  }

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
        <div className="flex items-center gap-6">
          <VerNoSite href={`/artigos/${slug}`} publicado={artigo.publicado} />
          <ConfirmarExclusao action={apagarArtigoAction.bind(null, slug)} />
        </div>
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
