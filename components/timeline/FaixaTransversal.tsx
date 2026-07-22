import Link from "next/link";
import type { ItemLinhaDoTempo } from "@/lib/timeline";

export function FaixaTransversal({ itens }: { itens: ItemLinhaDoTempo[] }) {
  if (itens.length === 0) return null;

  return (
    <div className="border-b border-borda bg-paper-mid py-6">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <p className="meta mb-3 text-lacre">Transversal</p>
        <div className="flex flex-wrap gap-3">
          {itens.map((item) => (
            <Link
              key={`${item.tipo}-${item.slug}`}
              href={item.url}
              className="meta border border-borda px-3 py-1.5 text-chumbo hover:border-lacre hover:text-lacre"
            >
              {item.titulo}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
