import Link from "next/link";
import Image from "next/image";
import type { Evento } from "@/lib/eventos";
import { SeloEvento } from "@/components/eventos/SeloEvento";
import { formatarData } from "@/lib/format";

export function EventoCard({ evento }: { evento: Evento }) {
  const comAndre = evento.participacao === "com_andre";

  return (
    <Link
      href={`/eventos/${evento.slug}`}
      className={`group flex flex-col border bg-paper transition-colors hover:border-lacre ${
        comAndre ? "border-lacre" : "border-borda"
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-mid">
        {evento.imagemCapa ? (
          <Image
            src={evento.imagemCapa}
            alt={evento.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl text-borda">
              {new Date(evento.dataInicio).getFullYear()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <SeloEvento
          natureza={evento.natureza}
          participacao={evento.participacao}
        />

        <h3 className="font-display text-xl leading-snug text-ink">
          {evento.titulo}
        </h3>

        <p className="line-clamp-2 font-serif text-[15px] leading-relaxed text-chumbo">
          {evento.descricao}
        </p>

        <p className="meta mt-auto text-chumbo-lt">
          {formatarData(evento.dataInicio)} · {evento.cidade}
        </p>
      </div>
    </Link>
  );
}
