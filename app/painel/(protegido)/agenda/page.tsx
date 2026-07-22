import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatarData } from "@/lib/format";

export default async function AgendaPainelPage() {
  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .order("data_inicio", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Agenda</h1>
        </div>
        <Link
          href="/painel/agenda/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo evento</span>
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {(eventos ?? []).length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum evento ainda.</p>
        )}
        {(eventos ?? []).map((evento) => (
          <Link
            key={evento.id}
            href={`/painel/agenda/${evento.id}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {formatarData(evento.data_inicio)} · {evento.cidade}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {evento.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {evento.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
