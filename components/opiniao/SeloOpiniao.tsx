// Selo dourado que marca uma peça como opinião — distinto do PeriodoBadge
// azul do artigo histórico. É a pista visual de que aquilo é a voz do autor,
// não exposição neutra. Reaproveitado em cards, na página e no OG.
export function SeloOpiniao({ className = "" }: { className?: string }) {
  return (
    <span
      className={`meta inline-flex items-center border border-ouro/50 bg-ouro/10 px-2.5 py-1 text-ouro ${className}`}
    >
      Opinião
    </span>
  );
}
