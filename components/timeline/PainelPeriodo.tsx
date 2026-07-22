import Link from "next/link";
import type { FaixaLinhaDoTempo } from "@/lib/timeline";

export function PainelPeriodo({ faixa }: { faixa: FaixaLinhaDoTempo }) {
  const { periodo, itens } = faixa;
  const inicio: number | null = periodo.inicio;
  const fim: number | null = periodo.fim;
  const anos =
    inicio !== null && fim !== null
      ? `${inicio}–${fim}`
      : inicio !== null
        ? `desde ${inicio}`
        : `até ${fim}`;

  return (
    <div className="flex w-full flex-col border-b border-paper/15 px-6 py-10 md:h-full md:w-[420px] md:shrink-0 md:border-b-0 md:border-r md:px-10">
      <p className="meta text-ouro">{anos}</p>
      <h2 className="mt-2 font-display text-2xl text-paper md:text-3xl">
        {periodo.label}
      </h2>

      <div className="mt-8 flex flex-1 flex-col gap-4 md:overflow-y-auto">
        {itens.length === 0 ? (
          <p className="meta text-paper/40">Em pesquisa</p>
        ) : (
          itens.map((item) => (
            <Link
              key={`${item.tipo}-${item.slug}`}
              href={item.url}
              className="group border border-paper/15 p-4 transition-colors hover:border-ouro"
            >
              <p className="meta text-paper/50">
                {item.tipo === "artigo" ? "Artigo" : "Acervo"} · {item.anoInicio}
              </p>
              <p className="mt-2 font-display text-lg leading-snug text-paper group-hover:text-ouro">
                {item.titulo}
              </p>
            </Link>
          ))
        )}
      </div>

      <Link
        href={`/linha-do-tempo/${periodo.id}`}
        className="meta mt-6 text-paper/50 hover:text-ouro"
      >
        Ver era completa →
      </Link>
    </div>
  );
}
