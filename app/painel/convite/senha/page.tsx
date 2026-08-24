"use client";

import { useActionState } from "react";
import { definirSenhaAction } from "./actions";

export default function DefinirSenhaPage() {
  const [erro, formAction, pendente] = useActionState(definirSenhaAction, null);

  return (
    <div className="flex min-h-[70vh] flex-col px-6 py-6 md:px-16 md:py-8 lg:px-20">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <p className="meta text-lacre">Painel</p>
          <h1 className="mt-3 font-display text-3xl text-ink">
            Bem-vindo(a) ao painel
          </h1>
          <p className="mt-3 font-serif text-sm text-chumbo">
            Defina uma senha pra entrar daqui em diante.
          </p>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="senha" className="meta mb-2 block text-chumbo-lt">
                Nova senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="confirmacao"
                className="meta mb-2 block text-chumbo-lt"
              >
                Confirmar senha
              </label>
              <input
                id="confirmacao"
                name="confirmacao"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
              />
            </div>

            {erro && <p className="font-serif text-sm text-lacre">{erro}</p>}

            <button
              type="submit"
              disabled={pendente}
              className="mt-2 border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
            >
              <span className="meta text-ouro">
                {pendente ? "Salvando…" : "Entrar no painel"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
