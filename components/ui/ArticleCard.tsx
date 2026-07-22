import Link from "next/link";
import Image from "next/image";
import type { PeriodoId } from "@/data/periodos";
import { getPeriodo } from "@/data/periodos";
import { formatarData } from "@/lib/format";

type ArticleCardProps = {
  titulo: string;
  excerpt: string;
  periodo: PeriodoId;
  href: string;
  data: string;
  leituraMinutos: number;
  imagemCapa?: string;
  variant?: "default" | "highlight";
  className?: string;
};

export function ArticleCard({
  titulo,
  excerpt,
  periodo,
  href,
  data,
  leituraMinutos,
  imagemCapa,
  variant = "default",
  className = "",
}: ArticleCardProps) {
  const highlight = variant === "highlight";
  const periodoLabel = getPeriodo(periodo).label;

  return (
    <Link
      href={href}
      className={`group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1.5 ${
        highlight ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-10" : ""
      } ${className}`}
    >
      <div
        className={`relative mb-6 aspect-[3/2] w-full overflow-hidden bg-paper-mid transition-shadow duration-400 group-hover:shadow-[0_24px_48px_-20px_rgba(13,13,13,0.35)] ${
          highlight ? "md:mb-0 md:aspect-auto md:h-full" : ""
        }`}
      >
        {imagemCapa ? (
          <Image
            src={imagemCapa}
            alt={titulo}
            fill
            className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl text-borda">
              {new Date(data).getFullYear()}
            </span>
          </div>
        )}
        <span className="meta absolute left-4 top-4 bg-ink/75 px-2.5 py-1.5 text-paper backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
          {periodoLabel}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col ${highlight ? "md:justify-center md:py-2" : ""}`}
      >
        <h3
          className={`mb-3 font-display font-bold leading-snug text-ink transition-colors group-hover:text-lacre ${
            highlight ? "text-2xl md:text-[1.9rem]" : "text-xl"
          }`}
        >
          {titulo}
        </h3>

        <p
          className={`mb-5 flex-1 font-serif font-light leading-relaxed text-chumbo ${
            highlight ? "text-[15px]" : "text-sm"
          }`}
        >
          {excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-borda pt-4">
          <span className="meta text-chumbo-lt">
            {formatarData(data)} · {leituraMinutos} min de leitura
          </span>
          <span
            aria-hidden
            className="translate-x-[-4px] text-sm text-lacre opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
