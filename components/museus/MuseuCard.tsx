import Link from "next/link";
import Image from "next/image";
import type { Museu } from "@/lib/museus";

export function MuseuCard({ museu }: { museu: Museu }) {
  return (
    <Link
      href={`/museus/${museu.slug}`}
      className="group flex flex-col border border-borda bg-paper transition-colors hover:border-lacre"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-mid">
        {museu.foto ? (
          <Image
            src={museu.foto}
            alt={museu.nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl text-borda">
              {museu.cidade}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="meta text-lacre">{museu.tipologia}</p>
        <h3 className="font-display text-xl leading-snug text-ink">
          {museu.nome}
        </h3>
        <p className="meta mt-auto text-chumbo-lt">{museu.cidade}</p>
      </div>
    </Link>
  );
}
