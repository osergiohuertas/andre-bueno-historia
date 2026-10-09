import Link from "next/link";
import { ImagemSegura } from "@/components/ui/ImagemSegura";
import { Monograma } from "@/components/ui/Monograma";

// Fecho do artigo. Artigo de colaborador mostra só o nome dele; o do André
// leva foto (se cadastrada em Configurações → Sobre) e o caminho para /sobre.
export function SobreAutor({
  autorNome,
  fotoUrl,
}: {
  autorNome?: string;
  fotoUrl?: string;
}) {
  if (autorNome) {
    return (
      <aside className="mt-16 border-t border-borda pt-8">
        <p className="meta text-chumbo-lt">Texto de</p>
        <p className="mt-2 font-display text-2xl text-ink">{autorNome}</p>
        <p className="mt-2 font-serif text-sm text-chumbo">
          Colaborador convidado do site de André Bueno.
        </p>
      </aside>
    );
  }

  return (
    <aside className="mt-16 flex items-center gap-6 border-y border-borda py-8">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ink text-ouro">
        <Monograma className="absolute inset-1.5" />
        {fotoUrl && (
          <ImagemSegura
            src={fotoUrl}
            alt="André Bueno"
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <p className="meta text-chumbo-lt">Texto de</p>
        <p className="mt-1 font-display text-2xl text-ink">André Bueno</p>
        <p className="mt-1 font-serif text-sm leading-relaxed text-chumbo">
          Historiador, pesquisador e gestor do patrimônio cultural.
        </p>
        <Link
          href="/sobre"
          className="meta mt-3 inline-flex items-center gap-1.5 text-lacre hover:gap-2.5"
        >
          Conheça a trajetória <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
