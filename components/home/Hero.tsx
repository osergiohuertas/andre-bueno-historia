import Link from "next/link";
import Image from "next/image";
import { PeriodoBadge } from "@/components/ui/PeriodoBadge";
import { TextoRico } from "@/components/ui/TextoRico";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/home/StatCounter";
import type { Artigo } from "@/lib/artigos";
import type { getHomeConfig } from "@/lib/home";

export function Hero({
  destaque,
  stats,
  config,
}: {
  destaque: Artigo;
  stats: { artigos: number; periodos: number; anos: number };
  config: Awaited<ReturnType<typeof getHomeConfig>>;
}) {
  return (
    <section className="grid border-b border-borda bg-paper md:min-h-[calc(100vh-5rem)] md:grid-cols-2">
      <Reveal className="flex flex-col justify-center border-borda px-6 py-16 md:border-r md:px-16 md:py-20 lg:px-20">
        <p className="meta flex items-center gap-3 text-lacre">
          <span className="h-px w-8 bg-lacre" aria-hidden />
          {config.heroEyebrow}
        </p>
        <TextoRico
          as="h1"
          valor={config.heroTitulo}
          className="mt-7 font-display text-[clamp(2.6rem,5vw,4.25rem)] font-black leading-[1.08] tracking-tight text-ink"
        />
        <p className="mt-7 max-w-md font-serif text-lg font-light leading-relaxed text-chumbo">
          {config.heroDescricao}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-7">
          <Link
            href="/artigos"
            className="border border-ink bg-ink px-8 py-3.5 text-ouro transition-colors hover:border-lacre hover:bg-lacre"
          >
            <span className="meta text-ouro">{config.ctaPrimario}</span>
          </Link>
          <Link
            href="/linha-do-tempo"
            className="group meta flex items-center gap-2 text-chumbo transition-colors hover:text-lacre"
          >
            {config.ctaSecundario}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-borda pt-10">
          <StatCounter valor={stats.artigos} label={config.stat1Label} />
          <StatCounter
            valor={stats.periodos}
            label={config.stat2Label}
            sufixo="/4"
          />
          <StatCounter valor={stats.anos} label={config.stat3Label} />
        </div>
      </Reveal>

      <Reveal className="relative min-h-[420px] overflow-hidden bg-ink md:min-h-0">
        {destaque.imagemCapa && (
          <Image
            src={destaque.imagemCapa}
            alt={destaque.titulo}
            fill
            priority
            className="object-cover opacity-55"
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute right-8 top-8 select-none font-display text-[6rem] font-black leading-none text-paper/[0.06] md:right-12 md:top-12 md:text-[7.5rem]"
        >
          {destaque.anoInicio}
        </span>
        <Link href={destaque.url} className="group absolute inset-0 flex items-end p-8 md:p-12">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20"
          />
          <div className="relative z-10">
            <p className="meta flex items-center gap-2.5 text-ouro">
              <span className="h-px w-6 bg-ouro" aria-hidden />
              Artigo em destaque
            </p>
            <h2 className="mt-4 font-display text-[1.7rem] font-bold leading-tight text-paper">
              {destaque.titulo}
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PeriodoBadge
                periodo={destaque.periodo}
                className="border-paper/30 text-ouro"
              />
              <span
                className="meta inline-flex items-center gap-1.5 text-ouro transition-[gap] group-hover:gap-2.5"
              >
                Ler artigo <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
