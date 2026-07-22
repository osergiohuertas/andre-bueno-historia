import { periodosOrdenados, type PeriodoId } from "@/data/periodos";

export function PeriodAxis({ periodo }: { periodo: PeriodoId }) {
  const ordem = periodosOrdenados();
  const transversal = periodo === "transversal";

  return (
    <div className="sticky top-24 hidden self-start lg:block">
      {transversal ? (
        <div className="meta -rotate-90 whitespace-nowrap text-ouro">
          Conteúdo transversal
        </div>
      ) : (
        <ol className="relative flex flex-col gap-4 border-l border-borda pl-4">
          {ordem.map((p) => {
            const ativo = p.id === periodo;
            return (
              <li key={p.id} className="relative">
                <span
                  aria-hidden
                  className={`absolute top-1 -left-[21px] h-2 w-2 rounded-full ${
                    ativo ? "bg-lacre" : "bg-borda"
                  }`}
                />
                <span
                  className={`meta block ${ativo ? "text-lacre" : "text-chumbo-lt/60"}`}
                >
                  {ativo ? p.label : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
