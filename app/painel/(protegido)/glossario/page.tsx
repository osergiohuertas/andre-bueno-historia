import Link from "next/link";
import { getTodosTermosGlossario } from "@/lib/glossario";

export default function GlossarioPainelPage() {
  const termos = getTodosTermosGlossario();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Glossário</h1>
        </div>
        <Link
          href="/painel/glossario/novo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo termo</span>
        </Link>
      </div>

      <p className="mt-4 max-w-prose font-serif text-sm text-chumbo-lt">
        Cada termo vira tooltip automaticamente onde aparecer em artigos e
        trabalhos técnicos — sem precisar marcar nada no texto.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {termos.length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum termo ainda.</p>
        )}
        {termos.map((t) => (
          <Link
            key={t.slug}
            href={`/painel/glossario/${t.slug}`}
            className="flex flex-col gap-1 border border-borda p-6 hover:border-lacre"
          >
            <p className="font-display text-xl text-ink">{t.termo}</p>
            <p className="line-clamp-2 font-serif text-sm text-chumbo">
              {t.definicao}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
