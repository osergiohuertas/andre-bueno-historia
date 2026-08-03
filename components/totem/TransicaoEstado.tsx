import type { ReactNode } from "react";

/**
 * Envelope de entrada pra cada tela do totem — fade + leve subida ao
 * montar. Retrigga sozinho: o TotemErrorBoundary já remonta os filhos a
 * cada troca de estado (key={chaveEstado(estado)} em TotemApp.tsx), então
 * não precisa de gerência de key própria aqui.
 */
export function TransicaoEstado({ children }: { children: ReactNode }) {
  return (
    <div className="totem-transicao-entrada absolute inset-0">{children}</div>
  );
}
