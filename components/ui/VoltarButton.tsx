"use client";

import { useRouter } from "next/navigation";

/**
 * Volta pra página anterior de verdade (histórico do navegador), não pra um
 * pai fixo — diferente do padrão "← Nome" já usado no painel, que existe
 * de propósito lá (um editor sempre quer voltar pra mesma listagem,
 * não importa de onde clicou). Aqui, quem chega numa página de artigo,
 * destino, evento etc. pode ter vindo de qualquer lugar do site — a home,
 * a busca, um link direto —, então "voltar" precisa ser literal.
 *
 * fallbackHref cobre o caso sem histórico (link direto, aba nova):
 * history.length fica em 1 nesse caso, e caímos pra um destino sensato
 * em vez de deixar o botão sem fazer nada.
 */
export function VoltarButton({
  fallbackHref,
  label = "Voltar",
  className = "",
}: {
  fallbackHref: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  function aoClicar() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`group meta inline-flex items-center gap-2 text-chumbo transition-colors hover:text-lacre ${className}`}
    >
      <span
        aria-hidden
        className="transition-transform group-hover:-translate-x-1"
      >
        ←
      </span>
      {label}
    </button>
  );
}
