import Image from "next/image";
import type { Publicacao } from "@/lib/obra";

const LABEL_TIPO: Record<Publicacao["tipo"], string> = {
  livro: "Livro",
  artigo_academico: "Artigo acadêmico",
  capitulo: "Capítulo",
  ensaio: "Ensaio",
};

export function PublicacaoCard({ publicacao }: { publicacao: Publicacao }) {
  const conteudo = (
    <div className="flex flex-col border border-borda bg-paper transition-colors hover:border-lacre md:flex-row">
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-paper-mid md:w-40">
        {publicacao.capa ? (
          <Image
            src={publicacao.capa}
            alt={publicacao.titulo}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl text-borda">
              {publicacao.ano}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="meta text-lacre">{LABEL_TIPO[publicacao.tipo]}</p>
        <h3 className="font-display text-xl leading-snug text-ink">
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
      </div>
    </div>
  );

  if (!publicacao.link) return conteudo;

  return (
    <a href={publicacao.link} target="_blank" rel="noreferrer">
      {conteudo}
    </a>
  );
}
