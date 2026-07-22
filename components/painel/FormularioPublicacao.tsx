"use client";

import { useActionState } from "react";
import type { EstadoPublicacao } from "@/app/painel/(protegido)/obra/publicacoes/actions";
import type { Database } from "@/types/supabase";

type Publicacao = Database["public"]["Tables"]["publicacoes"]["Row"];

export function FormularioPublicacao({
  publicacao,
  action,
}: {
  publicacao?: Publicacao;
  action: (
    estado: EstadoPublicacao,
    formData: FormData,
  ) => Promise<EstadoPublicacao>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <div>
        <label htmlFor="titulo" className="meta mb-1 block text-chumbo-lt">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          defaultValue={publicacao?.titulo}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <p className="meta mb-2 text-chumbo-lt">Tipo</p>
        <div className="flex flex-wrap gap-4">
          {(
            [
              { valor: "livro", label: "Livro" },
              { valor: "artigo_academico", label: "Artigo acadêmico" },
              { valor: "capitulo", label: "Capítulo" },
              { valor: "ensaio", label: "Ensaio" },
            ] as const
          ).map((opcao) => (
            <label key={opcao.valor} className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value={opcao.valor}
                defaultChecked={(publicacao?.tipo ?? "livro") === opcao.valor}
              />
              <span className="text-ink">{opcao.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="veiculo" className="meta mb-1 block text-chumbo-lt">
            Veículo / editora
          </label>
          <input
            id="veiculo"
            name="veiculo"
            defaultValue={publicacao?.veiculo}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ano" className="meta mb-1 block text-chumbo-lt">
            Ano
          </label>
          <input
            id="ano"
            name="ano"
            type="number"
            defaultValue={publicacao?.ano}
            required
            className="w-28 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="coautores" className="meta mb-1 block text-chumbo-lt">
          Coautores (opcional)
        </label>
        <input
          id="coautores"
          name="coautores"
          defaultValue={publicacao?.coautores ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="resumo" className="meta mb-1 block text-chumbo-lt">
          Resumo (opcional)
        </label>
        <textarea
          id="resumo"
          name="resumo"
          defaultValue={publicacao?.resumo ?? ""}
          rows={3}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="link" className="meta mb-1 block text-chumbo-lt">
          Link (opcional)
        </label>
        <input
          id="link"
          name="link"
          type="url"
          defaultValue={publicacao?.link ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="capa" className="meta mb-1 block text-chumbo-lt">
          URL da capa (opcional)
        </label>
        <input
          id="capa"
          name="capa"
          type="url"
          defaultValue={publicacao?.capa ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={publicacao?.publicado ?? false}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicado (aparece no site)</span>
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
