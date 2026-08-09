import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export type TermoGlossarioBruto = {
  termo: string;
  definicao: string;
};

/**
 * Lê o arquivo .json original do disco pra reeditar — o dado compilado do
 * Velite já serve pra isso aqui (o glossário não tem corpo MDX), mas lemos
 * do disco do mesmo jeito que artigos/acervo pra manter uma fonte única.
 */
export function lerTermoGlossarioBruto(slug: string): TermoGlossarioBruto | null {
  const caminho = path.join(process.cwd(), "content/glossario", `${slug}.json`);
  if (!existsSync(caminho)) return null;

  try {
    const dados = JSON.parse(readFileSync(caminho, "utf-8"));
    return { termo: String(dados.termo ?? ""), definicao: String(dados.definicao ?? "") };
  } catch {
    return null;
  }
}
