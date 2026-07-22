import { PublicacaoCard } from "@/components/obra/PublicacaoCard";
import type { Publicacao } from "@/lib/obra";

export function LivrosSection({ livros }: { livros: Publicacao[] }) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Catálogo</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Livros
        </h2>
        <p className="mt-4 max-w-prose font-serif text-chumbo">
          O catálogo completo de livros. Para a vitrine do livro mais
          recente, veja{" "}
          <a href="/livro" className="underline hover:text-lacre">
            /livro
          </a>
          .
        </p>
      </div>

      {livros.length === 0 ? (
        <p className="meta text-chumbo-lt">Nenhum livro cadastrado ainda.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {livros.map((livro) => (
            <PublicacaoCard key={livro.slug} publicacao={livro} />
          ))}
        </div>
      )}
    </section>
  );
}
