"use client";

import { useRef, useState } from "react";
import { blocosMdxSimples } from "@/lib/mdxSimplePreview";

/**
 * Campo de corpo MDX com um pouco de apoio — toolbar que envolve a
 * seleção (mesmo mecanismo de CampoTextoRico.tsx), contador de
 * palavras/estimativa de leitura em tempo real, e prévia colapsável
 * reaproveitando lib/mdxSimplePreview.ts. Antes disso era um `<textarea>`
 * cru em todo lugar que aceita corpo longo — artigo, opinião, trabalho
 * técnico, e o wizard de novo artigo.
 *
 * `onChange` é opcional: quem só precisa do valor no submit nativo do
 * formulário (`name` + FormData) não passa nada; o wizard passa pra
 * espelhar o texto no próprio estado (autosave em sessionStorage).
 */
export function CampoCorpoMdx({
  id = "corpo",
  name,
  valorInicial = "",
  onChange,
  required = true,
  rows = 18,
  label = "Corpo (MDX)",
  ajuda = "Parágrafos separados por linha em branco. Subtítulos com ##.",
}: {
  id?: string;
  name?: string;
  valorInicial?: string;
  onChange?: (texto: string) => void;
  required?: boolean;
  rows?: number;
  label?: string;
  ajuda?: string;
}) {
  const [texto, setTexto] = useState(valorInicial);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);

  function mudar(novo: string) {
    setTexto(novo);
    onChange?.(novo);
  }

  function envolver(marcador: string) {
    const el = ref.current;
    if (!el) return;
    const inicio = el.selectionStart;
    const fim = el.selectionEnd;
    if (inicio === fim) return;

    const novo =
      texto.slice(0, inicio) +
      marcador +
      texto.slice(inicio, fim) +
      marcador +
      texto.slice(fim);
    mudar(novo);
    requestAnimationFrame(() => el.focus());
  }

  function inserirSubtitulo() {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const inicioLinha = texto.lastIndexOf("\n", pos - 1) + 1;
    const novo = `${texto.slice(0, inicioLinha)}## ${texto.slice(inicioLinha)}`;
    mudar(novo);
    requestAnimationFrame(() => el.focus());
  }

  const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const leituraMinutos = Math.max(1, Math.round(palavras / 200));
  const blocos = blocosMdxSimples(texto);

  return (
    <div>
      <label htmlFor={id} className="meta mb-1 block text-chumbo-lt">
        {label}
      </label>
      <p className="mb-2 font-serif text-xs text-chumbo-lt">{ajuda}</p>

      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => envolver("**")}
          className="border border-borda px-3 py-1 font-semibold text-ink hover:border-lacre"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => envolver("*")}
          className="border border-borda px-3 py-1 italic text-ink hover:border-lacre"
        >
          I
        </button>
        <button
          type="button"
          onClick={inserirSubtitulo}
          className="border border-borda px-3 py-1 text-ink hover:border-lacre"
        >
          <span className="meta">## Subtítulo</span>
        </button>
      </div>

      <textarea
        ref={ref}
        id={id}
        name={name}
        value={texto}
        onChange={(e) => mudar(e.target.value)}
        rows={rows}
        required={required}
        className="w-full border border-borda bg-paper px-4 py-3 font-serif text-ink focus:border-lacre focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="meta text-chumbo-lt">
          {palavras} {palavras === 1 ? "palavra" : "palavras"} · ~
          {leituraMinutos} min de leitura
        </span>
        <button
          type="button"
          onClick={() => setMostrarPreview((v) => !v)}
          className="meta text-lacre hover:underline"
        >
          {mostrarPreview ? "Ocultar prévia" : "Ver prévia"}
        </button>
      </div>

      {mostrarPreview && (
        <div className="prose-artigo mt-3 border border-borda bg-paper-mid p-6">
          {blocos.length === 0 ? (
            <p className="meta text-chumbo-lt">Corpo vazio.</p>
          ) : (
            blocos.map((bloco, i) =>
              bloco.tipo === "h2" ? (
                <h2 key={i} className="mt-6 mb-3 font-display text-2xl text-ink">
                  {bloco.texto}
                </h2>
              ) : (
                <p key={i} className="mb-4 font-serif text-ink leading-relaxed">
                  {bloco.texto}
                </p>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
