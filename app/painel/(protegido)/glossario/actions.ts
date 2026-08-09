"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugUnico } from "@/lib/slug";
import { commitGlossarioJson, apagarGlossarioJson } from "@/lib/github";
import { lerTermoGlossarioBruto } from "@/lib/glossarioAdmin";

export type EstadoGlossario =
  | { ok: boolean; mensagem: string; url?: string }
  | null;

function revalidarGlossario() {
  revalidatePath("/painel/glossario");
}

function lerFormulario(formData: FormData) {
  return {
    termo: String(formData.get("termo") ?? "").trim(),
    definicao: String(formData.get("definicao") ?? "").trim(),
  };
}

function validar(dados: ReturnType<typeof lerFormulario>): string | null {
  if (!dados.termo || !dados.definicao) {
    return "Preencha o termo e a definição.";
  }
  return null;
}

function montarJson(dados: ReturnType<typeof lerFormulario>, slug: string): string {
  return `${JSON.stringify({ slug, termo: dados.termo, definicao: dados.definicao }, null, 2)}\n`;
}

export async function criarTermoGlossario(
  _estadoAnterior: EstadoGlossario,
  formData: FormData,
): Promise<EstadoGlossario> {
  const dados = lerFormulario(formData);
  const erro = validar(dados);
  if (erro) return { ok: false, mensagem: erro };

  const slug = slugUnico(dados.termo, (s) => !!lerTermoGlossarioBruto(s));
  const conteudoJson = montarJson(dados, slug);

  const resultado = await commitGlossarioJson(slug, conteudoJson);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarGlossario();
  return {
    ok: true,
    mensagem: `Publicado. Commit enviado para o GitHub — slug: ${slug}`,
    url: resultado.url,
  };
}

export async function atualizarTermoGlossario(
  slug: string,
  _estadoAnterior: EstadoGlossario,
  formData: FormData,
): Promise<EstadoGlossario> {
  const dados = lerFormulario(formData);
  const erro = validar(dados);
  if (erro) return { ok: false, mensagem: erro };

  const conteudoJson = montarJson(dados, slug);

  const resultado = await commitGlossarioJson(slug, conteudoJson);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }

  revalidarGlossario();
  return { ok: true, mensagem: "Salvo. Commit enviado para o GitHub.", url: resultado.url };
}

export async function apagarTermoGlossarioAction(
  slug: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const resultado = await apagarGlossarioJson(slug);
  if (!resultado.ok) {
    return { ok: false, mensagem: resultado.erro };
  }
  revalidarGlossario();
  redirect("/painel/glossario");
}
