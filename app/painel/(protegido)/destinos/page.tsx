import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DestinosPainelPage() {
  const supabase = await createClient();
  const { data: destinos } = await supabase
    .from("destinos")
    .select("*")
    .order("nome", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Destinos</h1>
        </div>
        <Link
          href="/painel/destinos/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo destino</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(destinos ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum destino ainda.</p>
        )}
        {(destinos ?? []).map((destino) => (
          <Link
            key={destino.id}
            href={`/painel/destinos/${destino.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {destino.tipologia} · {destino.cidade}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {destino.nome}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {destino.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
