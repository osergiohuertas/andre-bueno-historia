// || (não ??): a env var pode existir mas vazia ("NEXT_PUBLIC_SITE_URL="),
// e string vazia não aciona o ?? — só null/undefined acionam.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** URL absoluta pra usar em `alternates.canonical` — `caminho` já com a barra inicial. */
export function canonicalPara(caminho: string): string {
  return `${SITE_URL}${caminho}`;
}
