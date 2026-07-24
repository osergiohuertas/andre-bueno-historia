"use client";

import { useState } from "react";
import { useActionState } from "react";
import type { EstadoDestino } from "@/app/painel/(protegido)/destinos/actions";
import { TIPOLOGIAS_DESTINO } from "@/lib/destinos";
import type { Database } from "@/types/supabase";

type Destino = Database["public"]["Tables"]["destinos"]["Row"];

export function FormularioDestino({
  destino,
  action,
}: {
  destino?: Destino;
  action: (
    estado: EstadoDestino,
    formData: FormData,
  ) => Promise<EstadoDestino>;
}) {
  const [estado, formAction, pendente] = useActionState(action, null);

  const tipologiaInicial = destino?.tipologia ?? "";
  const eraPadrao = (TIPOLOGIAS_DESTINO as readonly string[]).includes(
    tipologiaInicial,
  );
  const [categoria, setCategoria] = useState(
    eraPadrao ? tipologiaInicial : tipologiaInicial ? "Outro" : "",
  );
  const [outroTexto, setOutroTexto] = useState(eraPadrao ? "" : tipologiaInicial);

  const tipologiaFinal = categoria === "Outro" ? outroTexto : categoria;

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="tipologia" value={tipologiaFinal} />

      <div>
        <label htmlFor="nome" className="meta mb-1 block text-chumbo-lt">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={destino?.nome}
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
            defaultValue={destino?.cidade}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="categoria" className="meta mb-1 block text-chumbo-lt">
            Categoria
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
          >
            <option value="" disabled>
              Escolha uma categoria
            </option>
            {TIPOLOGIAS_DESTINO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value="Outro">Outro…</option>
          </select>
          {categoria === "Outro" && (
            <input
              value={outroTexto}
              onChange={(e) => setOutroTexto(e.target.value)}
              placeholder="Digite a categoria"
              required
              className="mt-2 w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="endereco" className="meta mb-1 block text-chumbo-lt">
          Endereço
        </label>
        <input
          id="endereco"
          name="endereco"
          defaultValue={destino?.endereco}
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
            defaultValue={destino?.coordenadas?.lat}
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
            defaultValue={destino?.coordenadas?.lng}
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
            defaultValue={destino?.horario}
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
            defaultValue={destino?.ingresso}
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
            defaultValue={destino?.telefone ?? ""}
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
            defaultValue={destino?.site ?? ""}
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
          defaultValue={destino?.foto ?? ""}
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
          defaultValue={destino?.data_verificacao ?? ""}
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
          Camada 2: sua leitura editorial sobre o destino, além dos dados
          práticos.
        </p>
        <textarea
          id="texto_autoral"
          name="texto_autoral"
          defaultValue={destino?.texto_autoral ?? ""}
          rows={6}
          className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={destino?.publicado ?? false}
          className="h-5 w-5 border border-borda"
        />
        <span className="text-ink">Publicado (aparece no site)</span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendente || !tipologiaFinal}
          className="border border-ink bg-ink px-6 py-3 text-ouro transition-colors hover:bg-lacre hover:border-lacre disabled:cursor-not-allowed disabled:opacity-50"
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
