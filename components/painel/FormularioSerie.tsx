"use client";

import { useActionState } from "react";
import type { EstadoSerie } from "@/app/painel/(protegido)/series/actions";
import type { Database } from "@/types/supabase";

type Serie = Database["public"]["Tables"]["series"]["Row"];

export function FormularioSerie({
  serie,
  action,
}: {
  serie?: Serie;
  action: (estado: EstadoSerie, formData: FormData) => Promise<EstadoSerie>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <div>
        <label htmlFor="slug" className="meta mb-1 block text-chumbo-lt">
          Slug
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Usado no MDX do artigo (campo `serie`). Não muda depois de
          publicado, ou os artigos perdem o vínculo.
        </p>
        <input
          id="slug"
          name="slug"
          defaultValue={serie?.slug}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="numero" className="meta mb-1 block text-chumbo-lt">
          Número (romano)
        </label>
        <input
          id="numero"
          name="numero"
          defaultValue={serie?.numero}
          required
          placeholder="I, II, III…"
          className="w-full max-w-[8rem] border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="nome" className="meta mb-1 block text-chumbo-lt">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={serie?.nome}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="meta mb-1 block text-chumbo-lt">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={serie?.descricao ?? ""}
          rows={3}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label htmlFor="total_partes" className="meta mb-1 block text-chumbo-lt">
            Total de partes previsto
          </label>
          <input
            id="total_partes"
            name="total_partes"
            type="number"
            min={1}
            defaultValue={serie?.total_partes ?? undefined}
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ordem" className="meta mb-1 block text-chumbo-lt">
            Ordem de exibição
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            defaultValue={serie?.ordem ?? undefined}
            className="w-32 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={serie?.publicado ?? false}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicada (aparece no site)</span>
      </label>

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
          </p>
        )}
      </div>
    </form>
  );
}
