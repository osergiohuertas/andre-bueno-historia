import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FotosPainelPage() {
  const supabase = await createClient();
  const { data: fotos } = await supabase
    .from("acervo_midia")
    .select("*")
    .eq("tipo", "foto")
    .order("data", { ascending: false });

  return (
    <div>
      <Link href="/painel/obra" className="meta text-chumbo hover:text-lacre">
        ← Obra
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Fotos</h1>
        <Link
          href="/painel/obra/fotos/nova"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Nova foto</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(fotos ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhuma foto ainda.</p>
        )}
        {(fotos ?? []).map((foto) => (
          <Link
            key={foto.id}
            href={`/painel/obra/fotos/${foto.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {foto.credito ?? "sem crédito"}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {foto.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {foto.publicado ? "Publicada" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
