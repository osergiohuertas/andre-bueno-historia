"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export function Termo({
  children,
  "data-definicao": definicao,
}: {
  children?: ReactNode;
  "data-slug"?: string;
  "data-definicao"?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={aberto ? id : undefined}
        onMouseEnter={() => setAberto(true)}
        onMouseLeave={() => setAberto(false)}
        onFocus={() => setAberto(true)}
        onBlur={() => setAberto(false)}
        className="cursor-help border-b border-dotted border-chumbo-lt font-serif text-inherit"
      >
        {children}
      </button>
      {aberto && definicao && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 border border-borda bg-ink px-3 py-2 text-left font-sans text-xs leading-relaxed text-paper"
        >
          {definicao}
        </span>
      )}
    </span>
  );
}
