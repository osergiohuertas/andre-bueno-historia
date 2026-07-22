import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicacoesPainelPage() {
  const supabase = await createClient();
  const { data: publicacoes } = await supabase
    .from("publicacoes")
    .select("*")
    .order("ano", { ascending: false });

  return (
    <div>
      <Link href="/painel/obra" className="meta text-chumbo hover:text-lacre">
        ← Obra
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Publicações</h1>
        <Link
          href="/painel/obra/publicacoes/nova"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Nova publicação</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(publicacoes ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhuma publicação ainda.</p>
        )}
        {(publicacoes ?? []).map((publicacao) => (
          <Link
            key={publicacao.id}
            href={`/painel/obra/publicacoes/${publicacao.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {publicacao.tipo} · {publicacao.ano}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {publicacao.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {publicacao.publicado ? "Publicada" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
