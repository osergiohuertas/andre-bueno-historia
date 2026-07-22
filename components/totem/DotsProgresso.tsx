export function DotsProgresso({ total, ativo }: { total: number; ativo: number }) {
  if (total <= 1) return null;

  return (
    <div className="flex justify-center gap-2" role="presentation">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i === ativo ? "bg-ouro" : "bg-paper/25"
          }`}
        />
      ))}
    </div>
  );
}
