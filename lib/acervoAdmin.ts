import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PeriodoId } from "@/data/periodos";

export type AcervoMdxBruto = {
  titulo: string;
  periodo: PeriodoId;
  periodosSecundarios: PeriodoId[];
  anoInicio: number;
  anoFim?: number;
  regiao?: string;
  excerpt: string;
  fonte?: string;
  pdfUrl: string;
  imagemCapa?: string;
  tags: string[];
  publicado: boolean;
  data: string;
  corpo: string;
};

/**
 * Lê o arquivo .mdx original do disco e devolve frontmatter + corpo em
 * texto puro — o dado compilado do Velite não serve pra reeditar, já que o
 * `body` ali é código MDX compilado, não a fonte.
 */
export function lerAcervoMdxBruto(slug: string): AcervoMdxBruto | null {
  const caminho = path.join(
    process.cwd(),
    "content/acervo-documentos",
    `${slug}.mdx`,
  );
  if (!existsSync(caminho)) return null;

  const bruto = readFileSync(caminho, "utf-8");
  const match = bruto.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;

  const [, blocoFrontmatter, corpo] = match;
  const fm = parseYamlSimples(blocoFrontmatter);

  return {
    titulo: String(fm.titulo ?? ""),
    periodo: fm.periodo as PeriodoId,
    periodosSecundarios:
      (fm.periodosSecundarios as PeriodoId[] | undefined) ?? [],
    anoInicio: Number(fm.anoInicio ?? 0),
    anoFim: fm.anoFim !== undefined ? Number(fm.anoFim) : undefined,
    regiao: fm.regiao ? String(fm.regiao) : undefined,
    excerpt: String(fm.excerpt ?? ""),
    fonte: fm.fonte ? String(fm.fonte) : undefined,
    pdfUrl: String(fm.pdfUrl ?? ""),
    imagemCapa: fm.imagemCapa ? String(fm.imagemCapa) : undefined,
    tags: (fm.tags as string[] | undefined) ?? [],
    publicado: Boolean(fm.publicado),
    data: String(fm.data ?? ""),
    corpo: corpo.trim(),
  };
}

function parseYamlSimples(bloco: string): Record<string, unknown> {
  const resultado: Record<string, unknown> = {};
  for (const linhaBruta of bloco.split("\n")) {
    const linha = linhaBruta.trim();
    if (!linha) continue;
    const idx = linha.indexOf(":");
    if (idx === -1) continue;
    const chave = linha.slice(0, idx).trim();
    const valorBruto = linha.slice(idx + 1).trim();
    resultado[chave] = parseValorYaml(valorBruto);
  }
  return resultado;
}

function parseValorYaml(valor: string): unknown {
  if (valor.startsWith("[")) {
    try {
      return JSON.parse(valor);
    } catch {
      return [];
    }
  }
  if (valor.startsWith('"')) {
    try {
      return JSON.parse(valor);
    } catch {
      return valor;
    }
  }
  if (valor === "true") return true;
  if (valor === "false") return false;
  if (valor !== "" && !Number.isNaN(Number(valor))) return Number(valor);
  return valor;
}
