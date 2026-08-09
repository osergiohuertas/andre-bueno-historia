import { glossario } from "@/.velite";

export type { TermoGlossario } from "@/.velite";

export function getTodosTermosGlossario() {
  return [...glossario].sort((a, b) => a.termo.localeCompare(b.termo));
}
