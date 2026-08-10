import Link from "next/link";
import Image from "next/image";
import type { Publicacao } from "@/lib/obra";

const LABEL_TIPO: Record<Publicacao["tipo"], string> = {
  livro: "Livro",
  artigo_academico: "Artigo acadêmico",
  capitulo: "Capítulo",
  ensaio: "Ensaio",
};

export function ArtigoAcademicoCard({
  publicacao,
}: {
  publicacao: Publicacao;
}) {
  return (
    <div className="group flex flex-col border border-borda bg-paper transition-colors hover:border-lacre">
      <Link
        href={`/acervo/publicacoes/${publicacao.slug}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-mid">
          {publicacao.capa ? (
            <Image
              src={publicacao.capa}
              alt={publicacao.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-3xl text-borda">
                {publicacao.ano}
              </span>
            </div>
          )}
          <span className="meta absolute left-4 top-4 bg-ink/75 px-2.5 py-1.5 text-paper backdrop-blur-sm">
            {LABEL_TIPO[publicacao.tipo]}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-6">
          <h3 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-lacre">
            {publicacao.titulo}
          </h3>
          <p className="meta text-chumbo-lt">
            {publicacao.veiculo} · {publicacao.ano}
            {publicacao.coautores ? ` · com ${publicacao.coautores}` : ""}
          </p>
          {publicacao.resumo && (
            <p className="line-clamp-3 font-serif text-[15px] leading-relaxed text-chumbo">
              {publicacao.resumo}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-borda pt-4">
            <span className="meta text-lacre">Ler no site</span>
            <span
              aria-hidden
              className="translate-x-[-4px] text-sm text-lacre opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </div>
        </div>
      </Link>

      {publicacao.link && (
        <a
          href={publicacao.link}
          target="_blank"
          rel="noreferrer"
          className="meta border-t border-borda px-6 py-3 text-chumbo-lt hover:text-lacre"
        >
          Ver fonte — publicação original ↗
        </a>
      )}
    </div>
  );
}
