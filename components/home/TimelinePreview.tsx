import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { TimelineGrowLine } from "@/components/home/TimelineGrowLine";
import { getPeriodo } from "@/data/periodos";
import type { Artigo } from "@/lib/artigos";

export function TimelinePreview({ artigos }: { artigos: Artigo[] }) {
  if (artigos.length === 0) return null;

  const eventos = [...artigos]
    .sort((a, b) => a.anoInicio - b.anoInicio)
    .slice(0, 5);

  return (
    <Section tone="ink">
      <Container>
        <Reveal className="mb-16 flex items-end justify-between gap-4">
          <div>
            <p className="meta text-ouro">Linha do tempo</p>
            <h2 className="mt-3 font-display text-3xl text-paper">
              Da colônia à ditadura, em ordem.
            </h2>
          </div>
          <Link
            href="/linha-do-tempo"
            className="group meta flex items-center gap-2 whitespace-nowrap text-ouro"
          >
            Ver linha completa
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        <Reveal>
          <div className="relative pt-10">
            <TimelineGrowLine className="absolute inset-x-0 top-0" />

            <ol className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-5 md:gap-x-8">
              {eventos.map((artigo) => (
                <li key={artigo.slug} className="group relative pr-4">
                  <span
                    aria-hidden
                    className="absolute -top-[46px] left-0 h-2.5 w-2.5 rounded-full border-2 border-ouro bg-ouro shadow-[0_0_0_4px_rgba(184,144,42,0.2)] transition-transform duration-200 group-hover:scale-125"
                  />
                  <Link href={artigo.url} className="block">
                    <span className="font-display text-3xl font-bold leading-none text-paper/25">
                      {artigo.anoInicio}
                    </span>
                    <p className="mt-3 font-display text-[15px] font-semibold leading-snug text-paper transition-colors group-hover:text-ouro">
                      {artigo.titulo}
                    </p>
                    <span className="meta mt-2 block text-paper/35">
                      {getPeriodo(artigo.periodo).label}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
