import Link from "next/link";
import Image from "next/image";
import type { PeriodoId } from "@/data/periodos";
import { PeriodoBadge } from "@/components/ui/PeriodoBadge";

export function AcervoCard({
  titulo,
  excerpt,
  periodo,
  href,
  imagemCapa,
}: {
  titulo: string;
  excerpt: string;
  periodo: PeriodoId;
  href: string;
  imagemCapa?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-borda bg-paper transition-colors hover:border-lacre"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-mid">
        {imagemCapa ? (
          <Image
            src={imagemCapa}
            alt={titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="meta text-borda">PDF</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <PeriodoBadge periodo={periodo} className="w-fit" />
        <h3 className="font-display text-xl leading-snug text-ink">
          {titulo}
        </h3>
        <p className="line-clamp-3 font-serif text-[15px] leading-relaxed text-chumbo">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
