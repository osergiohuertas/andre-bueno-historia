export function BotaoInicio({ onTocar }: { onTocar: () => void }) {
  return (
    <button
      type="button"
      onClick={onTocar}
      className="meta absolute left-6 z-20 flex h-[52px] items-center gap-2 border border-paper/25 bg-ink/70 px-5 text-paper/80 backdrop-blur-sm transition-transform active:scale-[0.96] active:bg-paper/10"
      style={{ bottom: "6vh" }}
    >
      <span aria-hidden>←</span> Início
    </button>
  );
}
