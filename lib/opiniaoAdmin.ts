import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PeriodoId } from "@/data/periodos";

export type OpiniaoMdxBruto = {
  titulo: string;
  subtitulo?: string;
  excerpt: string;
  tags: string[];
  periodosRelacionados: PeriodoId[];
  artigosRelacionados: string[];
  imagemCapa?: string;
  destaque: boolean;
  publicado: boolean;
  data: string;
  corpo: string;
};

/**
 * Lê o arquivo .mdx original do disco e devolve frontmatter + corpo em
 * texto puro — mesmo motivo do lib/acervoAdmin.ts.
 */
export function lerOpiniaoMdxBruto(slug: string): OpiniaoMdxBruto | null {
  const caminho = path.join(process.cwd(), "content/opinioes", `${slug}.mdx`);
  if (!existsSync(caminho)) return null;

  const bruto = readFileSync(caminho, "utf-8");
  const match = bruto.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;

  const [, blocoFrontmatter, corpo] = match;
  const fm = parseYamlSimples(blocoFrontmatter);

  return {
    titulo: String(fm.titulo ?? ""),
    subtitulo: fm.subtitulo ? String(fm.subtitulo) : undefined,
    excerpt: String(fm.excerpt ?? ""),
    tags: (fm.tags as string[] | undefined) ?? [],
    periodosRelacionados:
      (fm.periodosRelacionados as PeriodoId[] | undefined) ?? [],
    artigosRelacionados: (fm.artigosRelacionados as string[] | undefined) ?? [],
    imagemCapa: fm.imagemCapa ? String(fm.imagemCapa) : undefined,
    destaque: Boolean(fm.destaque),
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
