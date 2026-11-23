// Data "pura" (2022-07-15, ou meia-noite UTC como o Velite grava) é um dia
// do calendário, não um instante: formatar no fuso local a jogaria pro dia
// anterior no Brasil (UTC-3). Já instantes com horário (agenda) são
// mostrados no horário de Brasília, igual no servidor e no navegador.
const SO_DATA = /^\d{4}-\d{2}-\d{2}(T00:00(:00(\.000)?)?(Z|\+00:00))?$/;

export function formatarData(data: string | Date): string {
  const texto = typeof data === "string" ? data : data.toISOString();
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: SO_DATA.test(texto) ? "UTC" : "America/Sao_Paulo",
  }).format(new Date(texto));
}
