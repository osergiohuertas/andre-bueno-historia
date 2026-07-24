import Link from "next/link";
import Image from "next/image";
import type { Destino } from "@/lib/destinos";

export function DestinoCard({ destino }: { destino: Destino }) {
  return (
    <Link
      href={`/destinos/${destino.slug}`}
      className="group flex flex-col border border-borda bg-paper transition-colors hover:border-lacre"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-mid">
        {destino.foto ? (
          <Image
            src={destino.foto}
            alt={destino.nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl text-borda">
              {destino.cidade}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="meta text-lacre">{destino.tipologia}</p>
        <h3 className="font-display text-xl leading-snug text-ink">
          {destino.nome}
        </h3>
        <p className="meta mt-auto text-chumbo-lt">{destino.cidade}</p>
      </div>
    </Link>
  );
}
