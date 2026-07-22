export function ResetAviso({
  segundosRestantes,
  onContinuar,
}: {
  segundosRestantes: number;
  onContinuar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onContinuar}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-ink/90"
      aria-live="polite"
    >
      <p className="meta text-ouro">Voltando ao início em {segundosRestantes}s…</p>
      <span className="meta border border-paper/30 bg-paper/5 px-6 py-3 text-paper">
        Continuar explorando
      </span>
    </button>
  );
}
