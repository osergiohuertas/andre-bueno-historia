import { sanitizarTextoRico } from "@/lib/textoRico";

export function TextoRico({
  valor,
  as: As = "span",
  className = "",
}: {
  valor: string;
  as?: "span" | "h1" | "h2" | "p";
  className?: string;
}) {
  return (
    <As
      className={`texto-rico ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizarTextoRico(valor) }}
    />
  );
}
