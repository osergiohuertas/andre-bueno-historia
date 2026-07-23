"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { commitArtigoMdx, apagarArtigoMdx } from "@/lib/github";
import { createClient } from "@/lib/supabase/server";
import type { PeriodoId } from "@/data/periodos";

export type EstadoArtigoEdicao =
  | { ok: boolean; mensagem: string; url?: string }
  | null;

function revalidarArtigo(slug: string) {
  revalidatePath("/painel/artigos");
  revalidatePath("/artigos");
  revalidatePath(`/artigos/${slug}`);
  revalidatePath("/");
}

function lerFormulario(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    subtitulo: String(formData.get("subtitulo") ?? "").trim(),
    periodo: (String(formData.get("periodo") ?? "") || null) as PeriodoId | null,
    periodosSecundarios: String(formData.get("periodosSecundarios") ?? "")
      .split(",")
      .filter(Boolean) as PeriodoId[],
    anoInicio: String(formData.get("anoInicio") ?? "").trim(),
    anoFim: String(formData.get("anoFim") ?? "").trim(),
    regiao: String(formData.get("regiao") ?? "").trim(),
    serie: String(formData.get("serie") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    imagemCapa: String(formData.get("imagemCapa") ?? "").trim(),
    conexaoLivro: String(formData.get("conexaoLivro") ?? "").trim(),
    corpo: String(formData.get("corpo") ?? "").trim(),
    publicado: formData.get("publicado") === "on",
    dataOriginal: String(formData.get("dataOriginal") ?? "").trim(),
    serieOriginal: String(formData.get("serieOriginal") ?? "").trim(),
    serieOrdemOriginal: String(formData.get("serieOrdemOriginal") ?? "").trim(),
  };
}

function validar(dados: ReturnType<typeof lerFormulario>): string | null {
  if (
    !dados.titulo ||
    !dados.periodo ||
    !dados.anoInicio ||
    !dados.excerpt ||
    !dados.corpo
  ) {
    return "Preencha os campos obrigatórios: título, período, ano de início, excerto e corpo.";
  }
  return null;
}

export async function atualizarArtigoAction(
  slug: string,
  _estadoAnterior: EstadoArtigoEdicao,
  formData: FormData,
): Promise<EstadoArtigoEdicao> {
  const dados = lerFormulario(formData);
  const erro = validar(dados);
  if (erro) return { ok: false, mensagem: erro };

  const leituraMinutos = Math.max(
    1,
    Math.round(dados.corpo.split(/\s+/).length / 200),
  );

  let serieOrdem: number | undefined;
  if (dados.serie) {
    if (dados.serie === dados.serieOriginal && dados.serieOrdemOriginal) {
      serieOrdem = Number(dados.serieOrdemOriginal);
    } else {
      try {
        const supabase = await createClient();
        const { count } = await supabase
          .from("series")
          .select("*", { count: "exact", head: true })
          .eq("slug", dados.serie);
        serieOrdem = (count ?? 0) + 1;
      } catch {
        serieOrdem = undefined;
      }
    }
  }

  const data = dados.dataOriginal || new Date().toISOString().slice(0, 10);

  const frontmatter: Record<string, unknown> = {
    titulo: dados.titulo,
    ...(dados.subtitulo ? { subtitulo: dados.subtitulo } : {}),
    slug,
    periodo: dados.periodo,
    ...(dados.periodosSecundarios.length
      ? { periodosSecundarios: dados.periodosSecundarios }
      : {}),
    anoInicio: Number(dados.anoInicio),
    ...(dados.anoFim ? { anoFim: Number(dados.anoFim) } : {}),
    ...(dados.regiao ? { regiao: dados.regiao } : {}),
    excerpt: dados.excerpt,
    leituraMinutos,
    tags: dados.tags,
    ...(dados.serie ? { serie: dados.serie, serieOrdem } : {}),
    ...(dados.imagemCapa ? { imagemCapa: dados.imagemCapa } : {}),
    ...(dados.conexaoLivro ? { conexaoLivro: dados.conexaoLivro } : {}),
    publicado: dados.publicado,
    data,
  };

  const yaml = Object.entries(frontmatter)
    .map(([chave, valor]) => `${chave}: ${formatarValorYaml(valor)}`)
    .join("\n");

  const conteudoMdx = `---\n${yaml}\n---\n\n${dados.corpo}\n`;

  const resultado = await commitArtigoMdx(slug, conteudoMdx);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarArtigo(slug);
  return {
    ok: true,
    mensagem: "Salvo. Commit enviado para o GitHub.",
    url: resultado.url,
  };
}

export async function apagarArtigoAction(
  slug: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const resultado = await apagarArtigoMdx(slug);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }
  revalidarArtigo(slug);
  redirect("/painel/artigos");
}

function formatarValorYaml(valor: unknown): string {
  if (Array.isArray(valor)) {
    return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
  }
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}
