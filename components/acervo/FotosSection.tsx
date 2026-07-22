import Image from "next/image";
import type { Midia } from "@/lib/obra";

export function FotosSection({ fotos }: { fotos: Midia[] }) {
  return (
    <section className="py-10 md:py-14">
      <div className="mb-10">
        <p className="meta text-lacre">Catálogo</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Fotos
        </h2>
      </div>

      {fotos.length === 0 ? (
        <p className="meta text-chumbo-lt">Nenhuma foto cadastrada ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto) => (
            <figure key={foto.id} className="border border-borda bg-paper">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-mid">
                <Image
                  src={foto.url}
                  alt={foto.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-serif text-sm text-ink">{foto.titulo}</p>
                {foto.credito && (
                  <p className="meta mt-1 text-chumbo-lt">
                    Crédito: {foto.credito}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
