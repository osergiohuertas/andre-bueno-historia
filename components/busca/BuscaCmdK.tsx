"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ResultadoPagefind = {
  url: string;
  titulo: string;
  excerpt: string;
};

type PagefindResultData = {
  url: string;
  meta: { title?: string };
  excerpt: string;
};

type PagefindModule = {
  init: () => Promise<void>;
  search: (
    query: string,
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] }>;
};

// O Pagefind indexa o HTML pré-renderizado em .next/server/app, então a
// URL do resultado é o caminho do arquivo (com .html) — não a rota real do
// Next.js. Precisa normalizar antes de usar como href.
function normalizarUrl(url: string): string {
  if (url.endsWith("/index.html")) return url.slice(0, -"index.html".length);
  if (url.endsWith(".html")) return url.slice(0, -".html".length);
  return url;
}

let pagefindPromise: Promise<PagefindModule | null> | null = null;

function carregarPagefind(): Promise<PagefindModule | null> {
  if (!pagefindPromise) {
    pagefindPromise = import(
      // @ts-expect-error — gerado em public/pagefind no postbuild, sem tipos e fora do programa TS.
      /* webpackIgnore: true */ "/pagefind/pagefind.js"
    )
      .then(async (mod) => {
        const pagefind = mod as PagefindModule;
        await pagefind.init();
        return pagefind;
      })
      .catch(() => null);
  }
  return pagefindPromise;
}

export function BuscaCmdK() {
  const [aberto, setAberto] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoPagefind[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [indisponivel, setIndisponivel] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buscaIdRef = useRef(0);

  function fechar() {
    setAberto(false);
    setQuery("");
    setResultados([]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  async function buscar(termo: string, idDaBusca: number) {
    const pagefind = await carregarPagefind();
    if (buscaIdRef.current !== idDaBusca) return;

    if (!pagefind) {
      setIndisponivel(true);
      setBuscando(false);
      return;
    }

    const busca = await pagefind.search(termo);
    const dados = await Promise.all(busca.results.slice(0, 8).map((r) => r.data()));

    if (buscaIdRef.current !== idDaBusca) return;

    setResultados(
      dados.map((d) => ({
        url: normalizarUrl(d.url),
        titulo: d.meta.title ?? d.url,
        excerpt: d.excerpt,
      })),
    );
    setBuscando(false);
  }

  function aoDigitar(valor: string) {
    setQuery(valor);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!valor.trim()) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    const idDaBusca = ++buscaIdRef.current;
    timeoutRef.current = setTimeout(() => buscar(valor, idDaBusca), 200);
  }

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAberto((v) => {
          const proximo = !v;
          if (!proximo) {
            setQuery("");
            setResultados([]);
          }
          return proximo;
        });
      }
      if (e.key === "Escape") {
        fechar();
      }
    }
    function aoPedirAbertura() {
      setAberto(true);
    }

    window.addEventListener("keydown", aoTeclar);
    window.addEventListener("abrir-busca", aoPedirAbertura);
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      window.removeEventListener("abrir-busca", aoPedirAbertura);
    };
  }, []);

  useEffect(() => {
    if (aberto) {
      inputRef.current?.focus();
    }
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/60 px-4 pt-24"
      onClick={fechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl border border-borda bg-paper"
      >
        <div className="border-b border-borda p-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => aoDigitar(e.target.value)}
            placeholder="Buscar artigos…"
            className="w-full bg-transparent px-4 py-3 text-ink placeholder:text-chumbo-lt focus:outline-none"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {indisponivel && (
            <p className="meta p-6 text-chumbo-lt">
              Busca indisponível neste ambiente.
            </p>
          )}

          {!indisponivel && buscando && (
            <p className="meta p-6 text-chumbo-lt">Buscando…</p>
          )}

          {!indisponivel && !buscando && query.trim() && resultados.length === 0 && (
            <p className="meta p-6 text-chumbo-lt">Nenhum resultado.</p>
          )}

          {resultados.map((resultado) => (
            <Link
              key={resultado.url}
              href={resultado.url}
              onClick={fechar}
              className="block border-b border-borda p-4 last:border-b-0 hover:bg-paper-mid"
            >
              <p className="font-display text-ink">{resultado.titulo}</p>
              <p
                className="mt-1 line-clamp-2 font-serif text-sm text-chumbo [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-lacre"
                dangerouslySetInnerHTML={{ __html: resultado.excerpt }}
              />
            </Link>
          ))}
        </div>

        <div className="border-t border-borda px-4 py-2">
          <p className="meta text-chumbo-lt">Esc para fechar</p>
        </div>
      </div>
    </div>
  );
}
