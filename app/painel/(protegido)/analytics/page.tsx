import {
  getTotalMembros,
  getTotalLeituras,
  getLeiturasPorPeriodo,
  getArtigosMaisLidos,
} from "@/lib/analytics";

// Painel admin com dado sempre fresco — sem isso, o Next tenta prerenderizar
// em build (não usa cookies(), então não teria sinal de que é dinâmico) e
// quebra sem as credenciais reais do Supabase.
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [totalMembros, totalLeituras, leiturasPorPeriodo, maisLidos] =
    await Promise.all([
      getTotalMembros(),
      getTotalLeituras(),
      getLeiturasPorPeriodo(),
      getArtigosMaisLidos(),
    ]);

  const maxPeriodo = Math.max(1, ...leiturasPorPeriodo.map((p) => p.leituras));
  const maxArtigo = Math.max(1, ...maisLidos.map((a) => a.leituras));

  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Analytics</h1>
      <p className="mt-3 max-w-prose font-serif text-sm text-chumbo-lt">
        Baseado no que a própria plataforma registra — marcações de
        &ldquo;lido&rdquo; na biblioteca pessoal dos leitores. Não inclui
        tráfego anônimo do Umami (exigiria uma integração à parte).
      </p>

      <div className="mt-10 grid gap-px border border-borda bg-borda sm:grid-cols-2">
        <div className="bg-paper p-8">
          <p className="meta text-chumbo-lt">Membros cadastrados</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {totalMembros}
          </p>
        </div>
        <div className="bg-paper p-8">
          <p className="meta text-chumbo-lt">Leituras registradas</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {totalLeituras}
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-xl text-ink">
          Leituras por período
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          {leiturasPorPeriodo.map((p) => (
            <div key={p.periodoId} className="flex items-center gap-4">
              <span className="meta w-40 shrink-0 text-chumbo-lt">
                {p.label}
              </span>
              <div className="h-6 flex-1 bg-paper-mid">
                <div
                  className="h-full bg-lacre"
                  style={{ width: `${(p.leituras / maxPeriodo) * 100}%` }}
                />
              </div>
              <span className="meta w-8 shrink-0 text-right text-chumbo-lt">
                {p.leituras}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-xl text-ink">Artigos mais lidos</h2>
        {maisLidos.length === 0 ? (
          <p className="mt-6 meta text-chumbo-lt">
            Nenhuma leitura registrada ainda.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {maisLidos.map((a) => (
              <div key={a.slug} className="flex items-center gap-4">
                <span className="meta w-64 shrink-0 truncate text-chumbo-lt">
                  {a.titulo}
                </span>
                <div className="h-6 flex-1 bg-paper-mid">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${(a.leituras / maxArtigo) * 100}%` }}
                  />
                </div>
                <span className="meta w-8 shrink-0 text-right text-chumbo-lt">
                  {a.leituras}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
