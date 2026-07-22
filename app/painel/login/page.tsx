"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { VoltarButton } from "@/components/ui/VoltarButton";

export default function LoginPage() {
  const [erro, formAction, pendente] = useActionState(login, null);

  return (
    <div className="flex min-h-[70vh] flex-col px-6 py-6 md:px-16 md:py-8 lg:px-20">
      <VoltarButton fallbackHref="/" />
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm">
        <p className="meta text-lacre">Painel</p>
        <h1 className="mt-3 font-display text-3xl text-ink">Entrar</h1>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="meta mb-2 block text-chumbo-lt">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
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
              autoComplete="current-password"
              className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          </div>

          {erro && <p className="text-sm text-lacre">{erro}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="mt-2 border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
          >
            <span className="meta text-ouro">{pendente ? "Entrando…" : "Entrar"}</span>
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
