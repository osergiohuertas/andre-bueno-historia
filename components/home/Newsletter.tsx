"use client";

import { useActionState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextoRico } from "@/components/ui/TextoRico";
import { Reveal } from "@/components/motion/Reveal";
import { inscreverNewsletterAction } from "@/app/(site)/actions";

export function Newsletter({
  titulo,
  corpo,
}: {
  titulo: string;
  corpo: string;
}) {
  const [estado, formAction, pendente] = useActionState(
    inscreverNewsletterAction,
    { status: "idle" },
  );

  return (
    <Section tone="ink" className="border-t border-ouro/40">
      <Container>
        <div className="grid items-center gap-16 md:grid-cols-2">
          <Reveal>
            <p className="meta flex items-center gap-3 text-ouro">
              <span className="h-px w-7 bg-ouro" aria-hidden />
              Carta mensal
            </p>
            <TextoRico
              as="h2"
              valor={titulo}
              className="mt-5 font-display text-3xl font-bold leading-tight text-paper md:text-4xl"
            />
            <p className="mt-5 font-serif text-base font-light leading-relaxed text-paper/70">
              {corpo}
            </p>
          </Reveal>

          <Reveal>
            {estado.status === "ok" ? (
              <p className="font-serif text-paper">
                Quase lá — confira seu e-mail para confirmar a inscrição.
              </p>
            ) : (
              <form action={formAction}>
                <label
                  htmlFor="newsletter-email"
                  className="meta mb-3 block text-paper/80"
                >
                  Seu melhor e-mail
                </label>
                <div className="flex">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="nome@email.com"
                    className="min-w-0 flex-1 border border-r-0 border-paper/30 bg-transparent px-5 py-3.5 font-serif text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={pendente}
                    className="group whitespace-nowrap border border-lacre bg-lacre px-7 py-3.5 transition-colors hover:border-paper hover:bg-paper disabled:opacity-50"
                  >
                    <span className="meta text-ouro group-hover:text-ink">
                      {pendente ? "Enviando…" : "Assinar"}
                    </span>
                  </button>
                </div>
                <p className="meta mt-4 leading-relaxed text-paper/40">
                  Sem spam. Sem frequência fixa. Cancele quando quiser, sem
                  perguntas.
                </p>
              </form>
            )}

            {estado.status === "erro" && (
              <p className="mt-4 inline-block border border-lacre bg-lacre px-3 py-1.5 meta text-paper">
                {estado.mensagem}
              </p>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
