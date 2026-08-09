"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";

/**
 * Filtro de texto client-side pra listas do painel — sem round-trip ao
 * servidor, porque o volume atual (dezenas de itens, não milhares) não
 * justifica paginação/busca server-side. A página (Server Component) já
 * renderiza cada item (Link + card) e só passa o resultado pronto junto
 * do texto pesquisável — funções não atravessam a fronteira servidor→
 * cliente, então o filtro em si não pode receber `campoBusca`/`renderItem`
 * como callback, só os nós já montados.
 *
 * Reusável: monte `itens` como `{ chave, busca, node }[]` na página. Já
 * aplicado em Artigos, Trabalhos técnicos, Destinos e Publicações — mesmo
 * padrão serve pra Opiniões, Séries, Agenda, Vídeos, Fotos e Glossário
 * quando o volume delas justificar.
 */
export function ListaFiltravel({
  itens,
  placeholder = "Buscar por título…",
  mensagemVazia = "Nada encontrado com essa busca.",
}: {
  itens: { chave: string; busca: string; node: ReactNode }[];
  placeholder?: string;
  mensagemVazia?: string;
}) {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const consulta = busca.trim().toLowerCase();
    if (!consulta) return itens;
    return itens.filter((item) => item.busca.toLowerCase().includes(consulta));
  }, [itens, busca]);

  return (
    <div>
      {itens.length > 0 && (
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={placeholder}
          className="w-full max-w-sm border border-borda bg-paper px-4 py-2.5 text-ink focus:border-lacre focus:outline-none"
        />
      )}

      <div className="mt-6 flex flex-col gap-3">
        {filtrados.length === 0 && (
          <p className="meta text-chumbo-lt">
            {itens.length === 0 ? "Nada cadastrado ainda." : mensagemVazia}
          </p>
        )}
        {filtrados.map((item) => (
          <Fragment key={item.chave}>{item.node}</Fragment>
        ))}
      </div>
    </div>
  );
}
