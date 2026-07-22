import { getPeriodo, type PeriodoId } from "@/data/periodos";

export function PeriodoBadge({
  periodo,
  className = "",
}: {
  periodo: PeriodoId;
  className?: string;
}) {
  const { label } = getPeriodo(periodo);

  return (
    <span
      className={`meta inline-flex items-center border border-borda px-2 py-1 text-lacre ${className}`}
    >
      {label}
    </span>
  );
}
