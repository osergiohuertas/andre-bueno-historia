// || (não ??): a env var pode existir mas vazia ("NEXT_PUBLIC_SITE_URL="),
// e string vazia não aciona o ?? — só null/undefined acionam.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
