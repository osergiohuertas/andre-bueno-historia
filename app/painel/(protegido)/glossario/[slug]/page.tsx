import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioGlossario } from "@/components/painel/FormularioGlossario";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarTermoGlossario,
  apagarTermoGlossarioAction,
} from "@/app/painel/(protegido)/glossario/actions";
import { lerTermoGlossarioBruto } from "@/lib/glossarioAdmin";

export default async function EditarTermoGlossarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const termo = lerTermoGlossarioBruto(slug);

  if (!termo) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/glossario"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Glossário
        </Link>
        <ConfirmarExclusao action={apagarTermoGlossarioAction.bind(null, slug)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">{termo.termo}</h1>

      <FormularioGlossario
        termo={termo}
        action={atualizarTermoGlossario.bind(null, slug)}
      />
    </div>
  );
}
