// Selo "AB" — assinatura visual do site, no espírito de um lacre de
// documento. Usa currentColor, então herda a cor do contexto.
export function Monograma({
  className = "",
  titulo = "André Bueno",
}: {
  className?: string;
  titulo?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={titulo} className={className}>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <path id="monograma-arco" d="M 22 60 A 38 38 0 0 1 98 60" fill="none" />
      <text
        fill="currentColor"
        fontSize="7.5"
        letterSpacing="2.6"
        style={{ fontFamily: "var(--font-inter), sans-serif", textTransform: "uppercase" }}
      >
        <textPath href="#monograma-arco" startOffset="50%" textAnchor="middle">
          História é Vida
        </textPath>
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fill="currentColor"
        fontSize="40"
        fontWeight="700"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        AB
      </text>
      <line x1="44" y1="88" x2="76" y2="88" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
    </svg>
  );
}
