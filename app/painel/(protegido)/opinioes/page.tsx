import Link from "next/link";
import { getTodasOpinioes } from "@/lib/opinioes";

export default function OpinioesPainelPage() {
  const opinioes = getTodasOpinioes();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">Opiniões</h1>
        </div>
        <Link
          href="/painel/nova-opiniao"
          className="border border-ink bg-ink px-5 py-2.5 text-ouro hover:bg-lacre hover:border-lacre"
        >
          <span className="meta text-ouro">Nova opinião</span>
        </Link>
      </div>

      <p className="mt-4 font-serif text-sm text-chumbo-lt">
        Opiniões são arquivos MDX publicados via commit no GitHub — a Vercel
        observa o repo e o deploy acontece sozinho depois do push.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {opinioes.length === 0 && (
          <p className="meta text-chumbo-lt">Nenhuma opinião ainda.</p>
        )}
        {opinioes.map((opiniao) => (
          <Link
            key={opiniao.slug}
            href={`/painel/opinioes/${opiniao.slug}`}
            className="flex items-center justify-between border border-borda p-6 hover:border-lacre"
          >
            <div>
              <p className="meta text-chumbo-lt">
                {opiniao.destaque ? "Em destaque" : "—"}
              </p>
              <p className="mt-1 font-display text-xl text-ink">
                {opiniao.titulo}
              </p>
            </div>
            <span className="meta text-chumbo-lt">
              {opiniao.publicado ? "Publicado" : "Rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
