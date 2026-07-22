import { PublicacaoCard } from "@/components/obra/PublicacaoCard";
import type { Publicacao } from "@/lib/obra";

export function PublicacoesSection({
  publicacoes,
}: {
  publicacoes: Publicacao[];
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Catálogo</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Publicações acadêmicas
        </h2>
        <p className="mt-4 max-w-prose font-serif text-chumbo">
          Artigos acadêmicos, capítulos e ensaios.
        </p>
      </div>

      {publicacoes.length === 0 ? (
        <p className="meta text-chumbo-lt">
          Nenhuma publicação cadastrada ainda.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {publicacoes.map((publicacao) => (
            <PublicacaoCard key={publicacao.slug} publicacao={publicacao} />
          ))}
        </div>
      )}
    </section>
  );
}
