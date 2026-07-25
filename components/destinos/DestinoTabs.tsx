import Link from "next/link";

export function DestinoTabs({
  tipologias,
  ativa,
}: {
  tipologias: string[];
  ativa: string | null;
}) {
  return (
    <div className="mb-10 flex flex-wrap gap-2">
      <Link
        href="/destinos"
        className={`meta border px-3 py-1.5 ${
          ativa === null
            ? "border-lacre bg-lacre text-ouro"
            : "border-borda text-chumbo hover:border-lacre"
        }`}
      >
        Todos
      </Link>
      {tipologias.map((tipologia) => (
        <Link
          key={tipologia}
          href={`/destinos/tipo/${encodeURIComponent(tipologia)}`}
          className={`meta border px-3 py-1.5 ${
            ativa === tipologia
              ? "border-lacre bg-lacre text-ouro"
              : "border-borda text-chumbo hover:border-lacre"
          }`}
        >
          {tipologia}
        </Link>
      ))}
    </div>
  );
}
