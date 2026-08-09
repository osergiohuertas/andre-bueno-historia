"use client";

import { useActionState } from "react";
import type { EstadoGlossario } from "@/app/painel/(protegido)/glossario/actions";

export function FormularioGlossario({
  termo,
  action,
}: {
  termo?: { termo: string; definicao: string };
  action: (estado: EstadoGlossario, formData: FormData) => Promise<EstadoGlossario>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <div>
        <label htmlFor="termo" className="meta mb-1 block text-chumbo-lt">
          Termo
        </label>
        <input
          id="termo"
          name="termo"
          defaultValue={termo?.termo}
          required
          className="w-full max-w-md border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="definicao" className="meta mb-1 block text-chumbo-lt">
          Definição
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Aparece como tooltip sempre que o termo surgir num artigo ou item
          do acervo — curta e direta.
        </p>
        <textarea
          id="definicao"
          name="definicao"
          defaultValue={termo?.definicao}
          rows={4}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:opacity-50"
        >
          <span className="meta text-ouro">{pendente ? "Salvando…" : "Salvar"}</span>
        </button>
        {estado && (
          <p className={`meta ${estado.ok ? "text-chumbo" : "text-lacre"}`}>
            {estado.mensagem}
            {estado.ok && estado.url && (
              <>
                {" — "}
                <a
                  href={estado.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-lacre"
                >
                  ver commit
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
