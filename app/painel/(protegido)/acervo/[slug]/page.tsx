import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioAcervo } from "@/components/painel/FormularioAcervo";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarAcervo,
  apagarAcervoAction,
} from "@/app/painel/(protegido)/acervo/actions";
import { contarAcervoPorPeriodo } from "@/lib/acervo";
import { lerAcervoMdxBruto } from "@/lib/acervoAdmin";

export default async function EditarAcervoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const acervo = lerAcervoMdxBruto(slug);

  if (!acervo) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/acervo"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Acervo documental
        </Link>
        <ConfirmarExclusao action={apagarAcervoAction.bind(null, slug)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{acervo.titulo}</h1>

      <FormularioAcervo
        acervo={{ slug, ...acervo }}
        contagens={contarAcervoPorPeriodo()}
        action={atualizarAcervo.bind(null, slug)}
      />
    </div>
  );
}
