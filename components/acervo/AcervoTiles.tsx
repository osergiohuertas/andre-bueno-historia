import Link from "next/link";

export type AcervoTile = {
  id: string;
  label: string;
  descricao: string;
  contagem?: number;
};

export function AcervoTiles({
  tiles,
  ativa,
}: {
  tiles: readonly AcervoTile[];
  ativa: string;
}) {
  return (
    <nav
      aria-label="Categorias do acervo"
      className="grid grid-cols-2 gap-px border border-borda bg-borda sm:grid-cols-3"
    >
      {tiles.map((tile) => {
        const ativo = tile.id === ativa;
        return (
          <Link
            key={tile.id}
            href={`/acervo?secao=${tile.id}`}
            aria-current={ativo ? "true" : undefined}
            className={`group flex flex-col gap-2 p-6 transition-colors md:p-8 ${
              ativo ? "bg-ink" : "bg-paper hover:bg-paper-mid"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`font-display text-xl font-bold ${
                  ativo ? "text-paper" : "text-ink group-hover:text-lacre"
                }`}
              >
                {tile.label}
              </span>
              {typeof tile.contagem === "number" && (
                <span
                  className={`meta ${ativo ? "text-paper/60" : "text-chumbo-lt"}`}
                >
                  {tile.contagem}
                </span>
              )}
            </div>
            <p
              className={`font-serif text-sm font-light leading-relaxed ${
                ativo ? "text-paper/70" : "text-chumbo"
              }`}
            >
              {tile.descricao}
            </p>
          </Link>
        );
      })}
    </nav>
  );
}
