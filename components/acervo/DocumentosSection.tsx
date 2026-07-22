import Link from "next/link";
import { AcervoCard } from "@/components/acervo/AcervoCard";
import { periodosOrdenados, type PeriodoId } from "@/data/periodos";
import type { AcervoDocumento } from "@/lib/acervo";

export function DocumentosSection({
  itens,
  comConteudo,
  periodo,
}: {
  itens: AcervoDocumento[];
  comConteudo: Set<PeriodoId>;
  periodo?: string;
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Peças originais</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Acervo documental
        </h2>
        <p className="mt-4 max-w-prose font-serif text-chumbo">
          Cada peça com anotação autoral — não é um repositório, é uma
          leitura curada.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/acervo?secao=documentos"
          className={`meta border px-3 py-1.5 ${
            !periodo
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          Todos
        </Link>
        {periodosOrdenados().map((p) => {
          const temConteudo = comConteudo.has(p.id as PeriodoId);
          if (!temConteudo) {
            return (
              <span
                key={p.id}
                aria-disabled="true"
                className="meta cursor-not-allowed border border-borda px-3 py-1.5 text-chumbo-lt/50"
              >
                {p.label}
              </span>
            );
          }
          return (
            <Link
              key={p.id}
              href={`/acervo?secao=documentos&periodo=${p.id}`}
              className={`meta border px-3 py-1.5 ${
                periodo === p.id
                  ? "border-lacre bg-lacre text-ouro"
                  : "border-borda text-chumbo hover:border-lacre"
              }`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>

      {itens.length === 0 ? (
        <p className="meta text-chumbo-lt">
          Nenhuma peça encontrada com esse filtro.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => (
            <AcervoCard
              key={item.slug}
              titulo={item.titulo}
              excerpt={item.excerpt}
              periodo={item.periodo}
              href={item.url}
              imagemCapa={item.imagemCapa}
            />
          ))}
        </div>
      )}
    </section>
  );
}
