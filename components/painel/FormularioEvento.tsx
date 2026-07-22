"use client";

import { useActionState } from "react";
import type { EstadoEvento } from "@/app/painel/(protegido)/agenda/actions";
import type { Database } from "@/types/supabase";

type Evento = Database["public"]["Tables"]["eventos"]["Row"];

function paraDatetimeLocal(valor?: string | null): string {
  if (!valor) return "";
  return valor.slice(0, 16);
}

export function FormularioEvento({
  evento,
  action,
}: {
  evento?: Evento;
  action: (estado: EstadoEvento, formData: FormData) => Promise<EstadoEvento>;
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
          defaultValue={evento?.titulo}
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
          defaultValue={evento?.descricao}
          required
          rows={3}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label htmlFor="data_inicio" className="meta mb-1 block text-chumbo-lt">
            Início
          </label>
          <input
            id="data_inicio"
            name="data_inicio"
            type="datetime-local"
            defaultValue={paraDatetimeLocal(evento?.data_inicio)}
            required
            className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="data_fim" className="meta mb-1 block text-chumbo-lt">
            Fim
          </label>
          <input
            id="data_fim"
            name="data_fim"
            type="datetime-local"
            defaultValue={paraDatetimeLocal(evento?.data_fim)}
            required
            className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="meta mb-2 text-chumbo-lt">Natureza</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="natureza"
                value="cultural"
                defaultChecked={(evento?.natureza ?? "cultural") === "cultural"}
              />
              <span className="text-ink">Cultural</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="natureza"
                value="academico"
                defaultChecked={evento?.natureza === "academico"}
              />
              <span className="text-ink">Acadêmico</span>
            </label>
          </div>
        </div>

        <div>
          <p className="meta mb-2 text-chumbo-lt">Participação</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="participacao"
                value="curadoria"
                defaultChecked={
                  (evento?.participacao ?? "curadoria") === "curadoria"
                }
              />
              <span className="text-ink">Curadoria</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="participacao"
                value="com_andre"
                defaultChecked={evento?.participacao === "com_andre"}
              />
              <span className="text-ink">Com André</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="local" className="meta mb-1 block text-chumbo-lt">
            Local
          </label>
          <input
            id="local"
            name="local"
            defaultValue={evento?.local}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cidade" className="meta mb-1 block text-chumbo-lt">
            Cidade
          </label>
          <input
            id="cidade"
            name="cidade"
            defaultValue={evento?.cidade}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="endereco" className="meta mb-1 block text-chumbo-lt">
          Endereço (opcional)
        </label>
        <input
          id="endereco"
          name="endereco"
          defaultValue={evento?.endereco ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="organizador" className="meta mb-1 block text-chumbo-lt">
          Organizador
        </label>
        <input
          id="organizador"
          name="organizador"
          defaultValue={evento?.organizador}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="link_inscricao" className="meta mb-1 block text-chumbo-lt">
          Link de inscrição (opcional)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          A plataforma nunca processa inscrição — sempre encaminha para o
          organizador.
        </p>
        <input
          id="link_inscricao"
          name="link_inscricao"
          type="url"
          defaultValue={evento?.link_inscricao ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="imagem_capa" className="meta mb-1 block text-chumbo-lt">
          URL da imagem de capa (opcional)
        </label>
        <input
          id="imagem_capa"
          name="imagem_capa"
          type="url"
          defaultValue={evento?.imagem_capa ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={evento?.publicado ?? false}
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
