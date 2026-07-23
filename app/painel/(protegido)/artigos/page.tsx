import Link from "next/link";
import { getTodosArtigos } from "@/lib/artigos";
import { getPeriodo } from "@/data/periodos";

export default function ArtigosPainelPage() {
  const artigos = getTodosArtigos();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Artigos</h1>
        </div>
        <Link
          href="/painel/novo-artigo"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Novo artigo</span>
        </Link>
      </div>

      <p className="mt-4 font-serif text-sm text-chumbo-lt">
        Artigos são arquivos MDX publicados via commit no GitHub — a Vercel
        observa o repo e o deploy acontece sozinho depois do push.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {artigos.length === 0 && (
          <p className="meta text-chumbo-lt">Nenhum artigo ainda.</p>
        )}
        {artigos.map((artigo) => (
          <Link
            key={artigo.slug}
            href={`/painel/artigos/${artigo.slug}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {getPeriodo(artigo.periodo).label}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {artigo.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {artigo.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
