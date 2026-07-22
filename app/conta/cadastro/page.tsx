"use client";

import Link from "next/link";
import { useActionState } from "react";
import { cadastrar } from "./actions";
import { VoltarButton } from "@/components/ui/VoltarButton";

const BENEFICIOS = [
  {
    numero: "I",
    titulo: "Carta mensal",
    descricao:
      "Uma vez por mês, uma carta direto no seu e-mail com o que o André está pesquisando, lendo e prestes a publicar — antes de sair no site.",
  },
  {
    numero: "II",
    titulo: "Biblioteca pessoal",
    descricao:
      "Salve artigos para ler depois e marque o que você já leu. Sua leitura fica guardada, não se perde no histórico do navegador.",
  },
  {
    numero: "III",
    titulo: "Acompanhar séries",
    descricao:
      "Siga uma série em andamento e receba um aviso por e-mail assim que a próxima parte for publicada.",
  },
] as const;

export default function CadastroPage() {
  const [estado, formAction, pendente] = useActionState(cadastrar, {
    status: "idle",
  });

  if (estado.status === "ok") {
    return (
      <div className="flex min-h-[70vh] flex-col px-6 py-6 md:px-16 md:py-8 lg:px-20">
        <VoltarButton fallbackHref="/" />
        <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <p className="meta text-lacre">Quase lá</p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            Confirme seu e-mail
          </h1>
          <p className="mt-4 font-serif text-chumbo">
            Mandamos um link de confirmação. Sua conta — e a carta mensal —
            só ficam ativas depois que você clicar nele.
          </p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 md:px-16 md:py-8 lg:px-20">
      <VoltarButton fallbackHref="/" />
      <div className="grid gap-16 py-10 md:grid-cols-2 md:items-center md:py-16">
      <div className="mx-auto w-full max-w-md md:mx-0">
        <p className="meta flex items-center gap-3 text-lacre">
          <span className="h-px w-8 bg-lacre" aria-hidden />
          Comunidade de leitores
        </p>
        <h1 className="mt-6 font-display text-3xl leading-tight text-ink md:text-4xl">
          Assine a carta e crie sua conta
        </h1>
        <p className="mt-4 font-serif text-lg font-light leading-relaxed text-chumbo">
          Uma conta só, três benefícios reais — sem spam, sem venda de
          dados, cancele quando quiser.
        </p>

        <ol className="mt-10 flex flex-col gap-8">
          {BENEFICIOS.map((beneficio) => (
            <li key={beneficio.numero} className="flex gap-5">
              <span className="w-9 shrink-0 text-right font-display text-2xl font-black leading-none text-borda">
                {beneficio.numero}
              </span>
              <div className="border-l border-borda pl-5">
                <h2 className="font-display text-lg text-ink">
                  {beneficio.titulo}
                </h2>
                <p className="mt-1.5 font-serif text-sm leading-relaxed text-chumbo">
                  {beneficio.descricao}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto w-full max-w-sm border border-borda bg-paper p-8 md:mx-0 md:p-10">
        <p className="meta text-chumbo-lt">Criar conta</p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          Leva menos de um minuto
        </h2>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="nome" className="meta mb-2 block text-chumbo-lt">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              required
              autoComplete="name"
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="meta mb-2 block text-chumbo-lt">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="senha" className="meta mb-2 block text-chumbo-lt">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
            <p className="mt-1 font-serif text-xs text-chumbo-lt">
              Pelo menos 8 caracteres.
            </p>
          </div>

          {estado.status === "erro" && (
            <p className="font-serif text-sm text-lacre">{estado.mensagem}</p>
          )}

          <button
            type="submit"
            disabled={pendente}
            className="mt-2 border border-ink bg-ink px-6 py-3 transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
          >
            <span className="meta text-ouro">
              {pendente ? "Criando…" : "Assinar carta e criar conta"}
            </span>
          </button>
        </form>

        <p className="mt-6 font-serif text-sm text-chumbo">
          Já tem conta?{" "}
          <Link href="/conta/entrar" className="text-lacre underline">
            Entrar
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
