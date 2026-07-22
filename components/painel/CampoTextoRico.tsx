"use client";

import { useRef, useState } from "react";
import { sanitizarTextoRico } from "@/lib/textoRico";
import type { Database } from "@/types/supabase";

type LinhaConfig = Database["public"]["Tables"]["site_config"]["Row"];

export function CampoTextoRico({ campo }: { campo: LinhaConfig }) {
  const [valor, setValor] = useState(campo.valor);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function envolver(tag: "em" | "strong") {
    const el = ref.current;
    if (!el) return;
    const inicio = el.selectionStart;
    const fim = el.selectionEnd;
    if (inicio === fim) return;

    const antes = valor.slice(0, inicio);
    const selecionado = valor.slice(inicio, fim);
    const depois = valor.slice(fim);
    const novo = `${antes}<${tag}>${selecionado}</${tag}>${depois}`;

    if (campo.max_chars && novo.length > campo.max_chars) return;

    setValor(novo);
    requestAnimationFrame(() => el.focus());
  }

  const previewHtml =
    sanitizarTextoRico(valor) ||
    '<span class="text-chumbo-lt">Pré-visualização aparece aqui</span>';

  return (
    <div>
      <label htmlFor={campo.chave} className="meta mb-1 block text-chumbo-lt">
        {campo.rotulo}
      </label>
      {campo.ajuda && (
        <p className="mb-2 font-serif text-xs text-chumbo-lt">
          {campo.ajuda}
        </p>
      )}

      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => envolver("strong")}
          className="border border-borda px-3 py-1 font-semibold text-ink hover:border-lacre"
          aria-label="Negrito"
        >
          N
        </button>
        <button
          type="button"
          onClick={() => envolver("em")}
          className="border border-borda px-3 py-1 italic text-ink hover:border-lacre"
          aria-label="Itálico"
        >
          I
        </button>
      </div>

      <textarea
        id={campo.chave}
        ref={ref}
        name={campo.chave}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        maxLength={campo.max_chars ?? undefined}
        rows={3}
        className="w-full border border-borda bg-paper px-4 py-3 text-ink focus:border-lacre focus:outline-none"
      />

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <p className="meta mb-1 text-chumbo-lt">Pré-visualização</p>
          <p
            className="texto-rico font-serif"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
        {campo.max_chars && (
          <span className="meta whitespace-nowrap text-chumbo-lt">
            {valor.length}/{campo.max_chars}
          </span>
        )}
      </div>
    </div>
  );
}
