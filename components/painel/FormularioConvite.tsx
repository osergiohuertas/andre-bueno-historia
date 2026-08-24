"use client";

import { useActionState } from "react";
import { convidarColaboradorAction } from "@/app/painel/(protegido)/colaboradores/actions";

export function FormularioConvite() {
  const [estado, formAction, pendente] = useActionState(
    convidarColaboradorAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 border border-borda p-6 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="nome" className="meta mb-1 block text-chumbo-lt">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="email" className="meta mb-1 block text-chumbo-lt">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pendente}
        className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
      >
        <span className="meta text-ouro">
          {pendente ? "Convidando…" : "Convidar"}
        </span>
      </button>

      {estado && (
        <p
          className={`meta w-full sm:w-auto ${estado.ok ? "text-chumbo" : "text-lacre"}`}
        >
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}
