/**
 * Selo de lacre — a assinatura visual do totem. "Lacre" já é o nome da
 * cor de destaque do site (#1B3B8F) por causa do lacre de cera de carta
 * antiga; aqui ele finalmente vira uma forma, não só uma palavra. Usado
 * com moderação: só na ponte QR (o momento de conversão) e no cabeçalho
 * do menu (a "casa" do totem) — ver plano de design.
 */
const TAMANHOS = {
  sm: { diametro: 40, fonte: 15 },
  lg: { diametro: 88, fonte: 30 },
} as const;

export function SeloLacre({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const { diametro, fonte } = TAMANHOS[size];

  return (
    <div
      aria-hidden
      className={`relative shrink-0 rounded-full bg-ouro ${className}`}
      style={{
        width: diametro,
        height: diametro,
        boxShadow:
          "inset 0 0 0 2px rgba(14,27,51,0.25), inset 0 2px 4px rgba(247,243,236,0.35), inset 0 -3px 6px rgba(14,27,51,0.3), 0 2px 6px rgba(0,0,0,0.35)",
      }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center rounded-full font-display italic text-ink"
        style={{ fontSize: fonte }}
      >
        AB
      </span>
      <span
        className="absolute rounded-full"
        style={{
          inset: diametro * 0.12,
          boxShadow: "inset 0 0 0 1px rgba(14,27,51,0.2)",
        }}
      />
    </div>
  );
}
