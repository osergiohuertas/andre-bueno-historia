import Link from "next/link";
import Image from "next/image";
import { formatarData } from "@/lib/format";
import { SeloOpiniao } from "@/components/opiniao/SeloOpiniao";

type OpiniaoCardProps = {
  titulo: string;
  subtitulo?: string;
  excerpt: string;
  href: string;
  data: string;
  leituraMinutos: number;
  imagemCapa?: string;
  variant?: "default" | "highlight";
  className?: string;
};

export function OpiniaoCard({
  titulo,
  subtitulo,
  excerpt,
  href,
  data,
  leituraMinutos,
  imagemCapa,
  variant = "default",
  className = "",
}: OpiniaoCardProps) {
  const highlight = variant === "highlight";

  return (
    <Link
      href={href}
      className={`group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1.5 ${
        highlight ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-10" : ""
      } ${className}`}
    >
      <div
        className={`relative mb-6 aspect-[3/2] w-full overflow-hidden bg-paper-mid transition-shadow duration-400 group-hover:shadow-[0_24px_48px_-20px_rgba(13,13,13,0.35)] ${
          highlight ? "md:mb-0 md:aspect-auto md:h-full md:min-h-[300px]" : ""
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
            <span className="font-display text-5xl italic text-borda">
              &ldquo;
            </span>
          </div>
        )}
        <SeloOpiniao className="absolute left-4 top-4 bg-ink/80 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5" />
      </div>

      <div
        className={`flex flex-1 flex-col ${highlight ? "md:justify-center md:py-2" : ""}`}
      >
        <h3
          className={`mb-2 font-display font-bold leading-snug text-ink transition-colors group-hover:text-lacre ${
            highlight ? "text-2xl md:text-[2.1rem]" : "text-xl"
          }`}
        >
          {titulo}
        </h3>

        {subtitulo && (
          <p
            className={`mb-3 font-serif italic leading-snug text-chumbo ${
              highlight ? "text-lg" : "text-sm"
            }`}
          >
            {subtitulo}
          </p>
        )}

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
