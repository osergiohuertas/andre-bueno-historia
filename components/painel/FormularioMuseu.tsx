"use client";

import { useActionState } from "react";
import type { EstadoMuseu } from "@/app/painel/(protegido)/museus/actions";
import type { Database } from "@/types/supabase";

type Museu = Database["public"]["Tables"]["museus"]["Row"];

export function FormularioMuseu({
  museu,
  action,
}: {
  museu?: Museu;
  action: (estado: EstadoMuseu, formData: FormData) => Promise<EstadoMuseu>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <div>
        <label htmlFor="nome" className="meta mb-1 block text-chumbo-lt">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={museu?.nome}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="cidade" className="meta mb-1 block text-chumbo-lt">
            Cidade
          </label>
          <input
            id="cidade"
            name="cidade"
            defaultValue={museu?.cidade}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="tipologia" className="meta mb-1 block text-chumbo-lt">
            Tipologia
          </label>
          <input
            id="tipologia"
            name="tipologia"
            defaultValue={museu?.tipologia}
            required
            placeholder="Museu histórico, casa-museu…"
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="endereco" className="meta mb-1 block text-chumbo-lt">
          Endereço
        </label>
        <input
          id="endereco"
          name="endereco"
          defaultValue={museu?.endereco}
          required
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label htmlFor="lat" className="meta mb-1 block text-chumbo-lt">
            Latitude
          </label>
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            defaultValue={museu?.coordenadas?.lat}
            required
            className="w-40 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="lng" className="meta mb-1 block text-chumbo-lt">
            Longitude
          </label>
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            defaultValue={museu?.coordenadas?.lng}
            required
            className="w-40 border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="horario" className="meta mb-1 block text-chumbo-lt">
            Horário
          </label>
          <input
            id="horario"
            name="horario"
            defaultValue={museu?.horario}
            required
            placeholder="Ter–dom, 9h–17h"
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="ingresso" className="meta mb-1 block text-chumbo-lt">
            Ingresso
          </label>
          <input
            id="ingresso"
            name="ingresso"
            defaultValue={museu?.ingresso}
            required
            placeholder="Gratuito, R$ 20…"
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <label htmlFor="telefone" className="meta mb-1 block text-chumbo-lt">
            Telefone (opcional)
          </label>
          <input
            id="telefone"
            name="telefone"
            defaultValue={museu?.telefone ?? ""}
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="site" className="meta mb-1 block text-chumbo-lt">
            Site oficial (opcional)
          </label>
          <input
            id="site"
            name="site"
            type="url"
            defaultValue={museu?.site ?? ""}
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="foto" className="meta mb-1 block text-chumbo-lt">
          URL da foto (opcional)
        </label>
        <input
          id="foto"
          name="foto"
          type="url"
          defaultValue={museu?.foto ?? ""}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="data_verificacao"
          className="meta mb-1 block text-chumbo-lt"
        >
          Dados verificados em
        </label>
        <input
          id="data_verificacao"
          name="data_verificacao"
          type="date"
          defaultValue={museu?.data_verificacao ?? ""}
          required
          className="border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="texto_autoral"
          className="meta mb-1 block text-chumbo-lt"
        >
          Texto autoral (opcional)
        </label>
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          Camada 2: sua leitura editorial sobre o museu, além dos dados
          práticos.
        </p>
        <textarea
          id="texto_autoral"
          name="texto_autoral"
          defaultValue={museu?.texto_autoral ?? ""}
          rows={6}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={museu?.publicado ?? false}
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
