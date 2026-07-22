"use server";

import { uploadImagem } from "@/lib/upload";
import { commitOpiniaoMdx } from "@/lib/github";
import { gerarSlug } from "@/lib/slug";
import type { PeriodoId } from "@/data/periodos";

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

export type EstadoPublicacaoOpiniao =
  | { ok: true; mensagem: string; url: string; slug: string }
  | { ok: false; mensagem: string }
  | null;

export async function publicarOpiniaoAction(
  _estado: EstadoPublicacaoOpiniao,
  formData: FormData,
): Promise<EstadoPublicacaoOpiniao> {
  const titulo = (formData.get("titulo") as string)?.trim();
  const subtitulo = (formData.get("subtitulo") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const corpo = (formData.get("corpo") as string)?.trim();
  const imagemCapa = (formData.get("imagemCapa") as string)?.trim();

  const tags = (formData.get("tags") as string)
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean) ?? [];

  const periodosRelacionados = (formData.get("periodosRelacionados") as string)
    ?.split(",")
    .map((p) => p.trim())
    .filter(Boolean) as PeriodoId[];

  const artigosRelacionados = (formData.get("artigosRelacionados") as string)
    ?.split(",")
    .map((a) => a.trim())
    .filter(Boolean) ?? [];

  const destaque = formData.get("destaque") === "on";
  const publicado = formData.get("publicado") === "on";

  if (!titulo || !excerpt || !corpo) {
    return { ok: false, mensagem: "Título, excerto e corpo são obrigatórios." };
  }

  const slug = gerarSlug(titulo);
  const leituraMinutos = Math.max(
    1,
    Math.round(corpo.split(/\s+/).length / 200),
  );

  const frontmatter: Record<string, unknown> = {
    titulo,
    ...(subtitulo ? { subtitulo } : {}),
    slug,
    excerpt,
    leituraMinutos,
    tags,
    ...(periodosRelacionados.length ? { periodosRelacionados } : {}),
    ...(artigosRelacionados.length ? { artigosRelacionados } : {}),
    ...(imagemCapa ? { imagemCapa } : {}),
    ...(destaque ? { destaque: true } : {}),
    publicado,
    data: new Date().toISOString().slice(0, 10),
  };

  const yaml = Object.entries(frontmatter)
    .map(([chave, valor]) => `${chave}: ${formatarValorYaml(valor)}`)
    .join("\n");

  const conteudoMdx = `---\n${yaml}\n---\n\n${corpo}\n`;

  const resultado = await commitOpiniaoMdx(slug, conteudoMdx);

  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  return {
    ok: true,
    mensagem: "Opinião publicada. O deploy sai sozinho em instantes.",
    url: resultado.url,
    slug,
  };
}

function formatarValorYaml(valor: unknown): string {
  if (Array.isArray(valor)) {
    return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
  }
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}
