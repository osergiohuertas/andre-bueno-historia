"use server";

import { revalidatePath } from "next/cache";
import { gerarSlug } from "@/lib/slug";
import { uploadImagem } from "@/lib/upload";
import { commitAcervoDocumentoMdx } from "@/lib/github";
import type { PeriodoId } from "@/data/periodos";

export type EstadoAcervo =
  | { ok: boolean; mensagem: string; url?: string }
  | null;

function revalidarAcervo(slug?: string) {
  revalidatePath("/painel/acervo");
  revalidatePath("/acervo");
  if (slug) revalidatePath(`/acervo/${slug}`);
}

export async function uploadImagemCapaAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return { ok: false, erro: "Nenhum arquivo enviado." };
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  return uploadImagem(buffer, arquivo.name);
}

function lerFormulario(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    periodo: (String(formData.get("periodo") ?? "") || null) as PeriodoId | null,
    periodosSecundarios: String(formData.get("periodosSecundarios") ?? "")
      .split(",")
      .filter(Boolean) as PeriodoId[],
    anoInicio: String(formData.get("anoInicio") ?? "").trim(),
    anoFim: String(formData.get("anoFim") ?? "").trim(),
    regiao: String(formData.get("regiao") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    fonte: String(formData.get("fonte") ?? "").trim(),
    pdfUrl: String(formData.get("pdfUrl") ?? "").trim(),
    imagemCapa: String(formData.get("imagemCapa") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    corpo: String(formData.get("corpo") ?? "").trim(),
    publicado: formData.get("publicado") === "on",
    dataOriginal: String(formData.get("dataOriginal") ?? "").trim(),
  };
}

function validar(dados: ReturnType<typeof lerFormulario>): string | null {
  if (
    !dados.titulo ||
    !dados.periodo ||
    !dados.anoInicio ||
    !dados.excerpt ||
    !dados.pdfUrl ||
    !dados.corpo
  ) {
    return "Preencha os campos obrigatórios: título, período, ano de início, excerto, link do PDF e corpo.";
  }
  return null;
}

function montarFrontmatter(
  dados: ReturnType<typeof lerFormulario>,
  slug: string,
  data: string,
): Record<string, unknown> {
  return {
    titulo: dados.titulo,
    slug,
    periodo: dados.periodo,
    ...(dados.periodosSecundarios.length
      ? { periodosSecundarios: dados.periodosSecundarios }
      : {}),
    anoInicio: Number(dados.anoInicio),
    ...(dados.anoFim ? { anoFim: Number(dados.anoFim) } : {}),
    ...(dados.regiao ? { regiao: dados.regiao } : {}),
    excerpt: dados.excerpt,
    ...(dados.fonte ? { fonte: dados.fonte } : {}),
    pdfUrl: dados.pdfUrl,
    ...(dados.imagemCapa ? { imagemCapa: dados.imagemCapa } : {}),
    tags: dados.tags,
    publicado: dados.publicado,
    data,
  };
}

function montarConteudoMdx(
  frontmatter: Record<string, unknown>,
  corpo: string,
): string {
  const yaml = Object.entries(frontmatter)
    .map(([chave, valor]) => `${chave}: ${formatarValorYaml(valor)}`)
    .join("\n");
  return `---\n${yaml}\n---\n\n${corpo}\n`;
}

export async function criarAcervo(
  _estadoAnterior: EstadoAcervo,
  formData: FormData,
): Promise<EstadoAcervo> {
  const dados = lerFormulario(formData);
  const erro = validar(dados);
  if (erro) return { ok: false, mensagem: erro };

  const slug = gerarSlug(dados.titulo);
  const data = new Date().toISOString().slice(0, 10);
  const frontmatter = montarFrontmatter(dados, slug, data);
  const conteudoMdx = montarConteudoMdx(frontmatter, dados.corpo);

  const resultado = await commitAcervoDocumentoMdx(slug, conteudoMdx);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarAcervo(slug);
  return {
    ok: true,
    mensagem: `Publicado. Commit enviado para o GitHub — slug: ${slug}`,
    url: resultado.url,
  };
}

export async function atualizarAcervo(
  slug: string,
  _estadoAnterior: EstadoAcervo,
  formData: FormData,
): Promise<EstadoAcervo> {
  const dados = lerFormulario(formData);
  const erro = validar(dados);
  if (erro) return { ok: false, mensagem: erro };

  const data = dados.dataOriginal || new Date().toISOString().slice(0, 10);
  const frontmatter = montarFrontmatter(dados, slug, data);
  const conteudoMdx = montarConteudoMdx(frontmatter, dados.corpo);

  const resultado = await commitAcervoDocumentoMdx(slug, conteudoMdx);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarAcervo(slug);
  return { ok: true, mensagem: "Salvo. Commit enviado para o GitHub.", url: resultado.url };
}

function formatarValorYaml(valor: unknown): string {
  if (Array.isArray(valor)) {
    return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
  }
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}
