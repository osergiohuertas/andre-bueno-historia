"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { commitOpiniaoMdx, apagarOpiniaoMdx } from "@/lib/github";
import type { PeriodoId } from "@/data/periodos";
import type { EstadoPublicacaoOpiniao } from "@/app/painel/(protegido)/nova-opiniao/actions";

function revalidarOpiniao(slug: string) {
  revalidatePath("/painel/opinioes");
  revalidatePath("/opiniao");
  revalidatePath(`/opiniao/${slug}`);
}

export async function atualizarOpiniaoAction(
  slug: string,
  _estado: EstadoPublicacaoOpiniao,
  formData: FormData,
): Promise<EstadoPublicacaoOpiniao> {
  const titulo = (formData.get("titulo") as string)?.trim();
  const subtitulo = (formData.get("subtitulo") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const corpo = (formData.get("corpo") as string)?.trim();
  const imagemCapa = (formData.get("imagemCapa") as string)?.trim();
  const dataOriginal = (formData.get("dataOriginal") as string)?.trim();

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
    data: dataOriginal || new Date().toISOString().slice(0, 10),
  };

  const yaml = Object.entries(frontmatter)
    .map(([chave, valor]) => `${chave}: ${formatarValorYaml(valor)}`)
    .join("\n");

  const conteudoMdx = `---\n${yaml}\n---\n\n${corpo}\n`;

  const resultado = await commitOpiniaoMdx(slug, conteudoMdx);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarOpiniao(slug);
  return {
    ok: true,
    mensagem: "Salvo. Commit enviado para o GitHub.",
    url: resultado.url,
    slug,
  };
}

export async function apagarOpiniaoAction(
  slug: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const resultado = await apagarOpiniaoMdx(slug);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }
  revalidarOpiniao(slug);
  redirect("/painel/opinioes");
}

function formatarValorYaml(valor: unknown): string {
  if (Array.isArray(valor)) {
    return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
  }
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}
