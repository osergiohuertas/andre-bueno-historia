import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const PASTAS = {
  artigos: "content/artigos",
  "acervo-documentos": "content/acervo-documentos",
} as const;

/**
 * Extrai o primeiro parágrafo real do corpo de um artigo ou item de acervo,
 * em texto puro, direto do .mdx bruto no disco — sem passar pelo pipeline
 * de compilação MDX (que exigiria `new Function()` + runtime JSX só pra
 * conseguir texto simples). O corpo em `.velite/*.json` já vem compilado
 * em função JS, não serve pra isso.
 *
 * Não há componentes MDX autorais no corpo (o glossário `<Termo>` é
 * aplicado automaticamente via rehype na compilação, nunca escrito à mão —
 * ver lib/rehypeGlossario.ts), então o corpo bruto é markdown simples:
 * parágrafos separados por linha em branco, headings `##`, `**negrito**`.
 */
export function extrairPreviaTexto(
  slug: string,
  colecao: keyof typeof PASTAS,
  maxPalavras = 100,
): string | null {
  const caminho = path.join(process.cwd(), PASTAS[colecao], `${slug}.mdx`);
  if (!existsSync(caminho)) return null;

  const bruto = readFileSync(caminho, "utf-8");
  const match = bruto.match(/^---\n[\s\S]*?\n---\n\n?([\s\S]*)$/);
  if (!match) return null;

  const corpo = match[1];
  const paragrafo = primeiroParagrafo(corpo);
  if (!paragrafo) return null;

  return truncarPalavras(limparMarkdown(paragrafo), maxPalavras);
}

function primeiroParagrafo(corpo: string): string | null {
  const blocos = corpo.trim().split(/\n{2,}/);
  for (const bloco of blocos) {
    const linha = bloco.trim();
    if (!linha) continue;
    if (linha.startsWith("#")) continue; // heading, não é prosa
    if (linha.startsWith(">")) continue; // citação/callout, prosa vem depois
    return linha;
  }
  return null;
}

function limparMarkdown(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function truncarPalavras(texto: string, maxPalavras: number): string {
  const palavras = texto.split(" ");
  if (palavras.length <= maxPalavras) return texto;
  return `${palavras.slice(0, maxPalavras).join(" ")}…`;
}
