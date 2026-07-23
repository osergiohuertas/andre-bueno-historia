import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioPublicacao } from "@/components/painel/FormularioPublicacao";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import {
  atualizarPublicacao,
  apagarPublicacao,
} from "@/app/painel/(protegido)/obra/publicacoes/actions";

export default async function EditarPublicacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: publicacao } = await supabase
    .from("publicacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (!publicacao) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/painel/obra/publicacoes"
          className="meta text-chumbo hover:text-lacre"
        >
          ← Publicações
        </Link>
        <ConfirmarExclusao action={apagarPublicacao.bind(null, id)} />
      </div>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {publicacao.titulo}
      </h1>

      <FormularioPublicacao
        publicacao={publicacao}
        action={atualizarPublicacao.bind(null, id)}
      />
    </div>
  );
}
