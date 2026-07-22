import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MuseusPainelPage() {
  const supabase = await createClient();
  const { data: museus } = await supabase
    .from("museus")
    .select("*")
    .order("nome", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Museus</h1>
        </div>
        <Link
          href="/painel/museus/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo museu</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(museus ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum museu ainda.</p>
        )}
        {(museus ?? []).map((museu) => (
          <Link
            key={museu.id}
            href={`/painel/museus/${museu.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {museu.tipologia} · {museu.cidade}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {museu.nome}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {museu.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
