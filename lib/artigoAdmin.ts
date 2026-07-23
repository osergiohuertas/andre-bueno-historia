import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PeriodoId } from "@/data/periodos";

export type ArtigoMdxBruto = {
  titulo: string;
  subtitulo?: string;
  periodo: PeriodoId;
  periodosSecundarios: PeriodoId[];
  anoInicio: number;
  anoFim?: number;
  regiao?: string;
  excerpt: string;
  tags: string[];
  serie?: string;
  serieOrdem?: number;
  imagemCapa?: string;
  conexaoLivro?: string;
  publicado: boolean;
  data: string;
  corpo: string;
};

/**
 * Lê o arquivo .mdx original do disco e devolve frontmatter + corpo em
 * texto puro — mesmo motivo do lib/acervoAdmin.ts: o `body` compilado pelo
 * Velite não serve pra reeditar, só o bruto do disco tem a fonte MDX.
 */
export function lerArtigoMdxBruto(slug: string): ArtigoMdxBruto | null {
  const caminho = path.join(process.cwd(), "content/artigos", `${slug}.mdx`);
  if (!existsSync(caminho)) return null;

  const bruto = readFileSync(caminho, "utf-8");
  const match = bruto.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;

  const [, blocoFrontmatter, corpo] = match;
  const fm = parseYamlSimples(blocoFrontmatter);

  return {
    titulo: String(fm.titulo ?? ""),
    subtitulo: fm.subtitulo ? String(fm.subtitulo) : undefined,
    periodo: fm.periodo as PeriodoId,
    periodosSecundarios:
      (fm.periodosSecundarios as PeriodoId[] | undefined) ?? [],
    anoInicio: Number(fm.anoInicio ?? 0),
    anoFim: fm.anoFim !== undefined ? Number(fm.anoFim) : undefined,
    regiao: fm.regiao ? String(fm.regiao) : undefined,
    excerpt: String(fm.excerpt ?? ""),
    tags: (fm.tags as string[] | undefined) ?? [],
    serie: fm.serie ? String(fm.serie) : undefined,
    serieOrdem: fm.serieOrdem !== undefined ? Number(fm.serieOrdem) : undefined,
    imagemCapa: fm.imagemCapa ? String(fm.imagemCapa) : undefined,
    conexaoLivro: fm.conexaoLivro ? String(fm.conexaoLivro) : undefined,
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
