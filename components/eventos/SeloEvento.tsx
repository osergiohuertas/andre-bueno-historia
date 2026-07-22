import type { Natureza, Participacao } from "@/lib/eventos";

export function SeloEvento({
  natureza,
  participacao,
}: {
  natureza: Natureza;
  participacao: Participacao;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`meta border px-2 py-1 text-[10px] ${
          natureza === "cultural"
            ? "border-ink bg-ink text-ouro"
            : "border-lacre text-lacre"
        }`}
      >
        {natureza === "cultural" ? "Cultural" : "Acadêmico"}
      </span>
      {participacao === "com_andre" && (
        <span className="meta border border-lacre bg-lacre px-2 py-1 text-[10px] text-paper">
          Com André Bueno
        </span>
      )}
    </div>
  );
}
