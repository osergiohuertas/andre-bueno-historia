import Link from "next/link";
import { periodosOrdenados, PERIODOS, type PeriodoId } from "@/data/periodos";
import { getPeriodosComConteudo } from "@/lib/artigos";

type FiltrosAtivos = {
  periodo?: string;
  regiao?: string;
  tag?: string;
};

function construirHref(atuais: FiltrosAtivos, chave: keyof FiltrosAtivos, valor: string) {
  const params = new URLSearchParams();
  const proximo = { ...atuais };

  if (proximo[chave] === valor) {
    delete proximo[chave];
  } else {
    proximo[chave] = valor;
  }

  for (const [k, v] of Object.entries(proximo)) {
    if (v) params.set(k, v);
  }

  const query = params.toString();
  return query ? `/artigos?${query}` : "/artigos";
}

function Pill({
  href,
  ativo,
  desabilitado,
  children,
}: {
  href?: string;
  ativo?: boolean;
  desabilitado?: boolean;
  children: React.ReactNode;
}) {
  const classeBase =
    "meta inline-flex items-center border px-3 py-1.5 transition-colors";

  if (desabilitado || !href) {
    return (
      <span
        className={`${classeBase} cursor-not-allowed border-borda text-chumbo-lt/50`}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${classeBase} ${
        ativo
          ? "border-lacre bg-lacre text-ouro"
          : "border-borda text-chumbo hover:border-lacre hover:text-lacre"
      }`}
    >
      {children}
    </Link>
  );
}

export function Filtros({
  ativos,
  regioes,
  tags,
}: {
  ativos: FiltrosAtivos;
  regioes: string[];
  tags: string[];
}) {
  const periodosComConteudo = getPeriodosComConteudo();
  const temFiltroAtivo = Boolean(ativos.periodo || ativos.regiao || ativos.tag);

  return (
    <div className="flex flex-col gap-8 border-b border-borda pb-10">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="meta text-chumbo-lt">Período</p>
          {temFiltroAtivo && (
            <Link href="/artigos" className="meta text-lacre hover:underline">
              Limpar filtros
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[...periodosOrdenados(), getTransversal()].map((periodo) => (
            <Pill
              key={periodo.id}
              href={
                periodosComConteudo.has(periodo.id)
                  ? construirHref(ativos, "periodo", periodo.id)
                  : undefined
              }
              ativo={ativos.periodo === periodo.id}
              desabilitado={!periodosComConteudo.has(periodo.id)}
            >
              {periodo.label}
            </Pill>
          ))}
        </div>
      </div>

      {regioes.length > 0 && (
        <div>
          <p className="meta mb-3 text-chumbo-lt">Região</p>
          <div className="flex flex-wrap gap-2">
            {regioes.map((regiao) => (
              <Pill
                key={regiao}
                href={construirHref(ativos, "regiao", regiao)}
                ativo={ativos.regiao === regiao}
              >
                {regiao}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <p className="meta mb-3 text-chumbo-lt">Tema</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Pill
                key={tag}
                href={construirHref(ativos, "tag", tag)}
                ativo={ativos.tag === tag}
              >
                {tag}
              </Pill>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTransversal() {
  return PERIODOS.find((p) => p.id === "transversal") as {
    id: PeriodoId;
    label: string;
  };
}
