"use client";

import { trackEvent } from "@/lib/umami";

function comTagAfiliado(url: string, tag?: string): string {
  if (!tag) return url;
  const separador = url.includes("?") ? "&" : "?";
  return `${url}${separador}tag=${encodeURIComponent(tag)}`;
}

const TONS = {
  claro: "border-ink bg-ink hover:bg-lacre hover:border-lacre",
  escuro: "border-ouro bg-ouro hover:bg-transparent",
};

const TONS_TEXTO = {
  claro: "text-ouro",
  escuro: "text-ink group-hover:text-ouro",
};

export function AmazonCTA({
  url,
  tagAfiliado,
  tom = "claro",
  label = "Comprar na Amazon",
  className = "",
}: {
  url: string;
  tagAfiliado?: string;
  tom?: "claro" | "escuro";
  label?: string;
  className?: string;
}) {
  const href = comTagAfiliado(url, tagAfiliado);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => trackEvent("clique-amazon-livro")}
      className={`group inline-flex items-center justify-center border px-8 py-4 transition-colors ${TONS[tom]} ${className}`}
    >
      <span className={`meta ${TONS_TEXTO[tom]}`}>{label}</span>
    </a>
  );
}
