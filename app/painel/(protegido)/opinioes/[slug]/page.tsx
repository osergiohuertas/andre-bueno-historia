import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioOpiniao } from "@/components/painel/FormularioOpiniao";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarOpiniaoAction,
  apagarOpiniaoAction,
} from "@/app/painel/(protegido)/opinioes/actions";
import { lerOpiniaoMdxBruto } from "@/lib/opiniaoAdmin";
import { getArtigosPublicados } from "@/lib/artigos";
import { PERIODOS } from "@/data/periodos";

export default async function EditarOpiniaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opiniao = lerOpiniaoMdxBruto(slug);

  if (!opiniao) notFound();

  const artigos = getArtigosPublicados().map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
  }));
  const periodos = PERIODOS.map((p) => ({ id: p.id, label: p.label }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/opinioes"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Opiniões
        </Link>
        <ConfirmarExclusao action={apagarOpiniaoAction.bind(null, slug)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{opiniao.titulo}</h1>

      <FormularioOpiniao
        periodos={periodos}
        artigos={artigos}
        opiniao={{ slug, ...opiniao }}
        action={atualizarOpiniaoAction.bind(null, slug)}
      />
    </div>
  );
}
