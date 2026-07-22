import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SeriesPainelPage() {
  const supabase = await createClient();
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .order("ordem", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Séries</h1>
        </div>
        <Link
          href="/painel/series/nova"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Nova série</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(series ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhuma série ainda.</p>
        )}
        {(series ?? []).map((serie) => (
          <Link
            key={serie.id}
            href={`/painel/series/${serie.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">Série {serie.numero}</p>
              <p className="mt-1 font-display text-xl text-ink">
                {serie.nome}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {serie.publicado ? "Publicada" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
