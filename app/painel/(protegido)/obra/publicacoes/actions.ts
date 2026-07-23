"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";

export type EstadoPublicacao = { ok: boolean; mensagem: string } | null;

function revalidarObra() {
  revalidatePath("/painel/obra/publicacoes");
  revalidatePath("/acervo");
}

function lerFormulario(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    tipo: String(formData.get("tipo") ?? "livro") as
      | "livro"
      | "artigo_academico"
      | "capitulo"
      | "ensaio",
    veiculo: String(formData.get("veiculo") ?? "").trim(),
    ano: Number(formData.get("ano") ?? new Date().getFullYear()),
    coautores: String(formData.get("coautores") ?? "").trim() || null,
    link: String(formData.get("link") ?? "").trim() || null,
    resumo: String(formData.get("resumo") ?? "").trim() || null,
    capa: String(formData.get("capa") ?? "").trim() || null,
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarPublicacao(
  _estadoAnterior: EstadoPublicacao,
  formData: FormData,
): Promise<EstadoPublicacao> {
  const dados = lerFormulario(formData);

  if (!dados.titulo || !dados.veiculo || !dados.ano) {
    return { ok: false, mensagem: "Título, veículo e ano são obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("publicacoes").insert({
    ...dados,
    slug: gerarSlug(`${dados.titulo}-${dados.ano}`),
  });

  if (error) {
    return {
      ok: false,
      mensagem:
        error.code === "23505"
          ? "Já existe uma publicação muito parecida."
          : "Erro ao criar a publicação.",
    };
  }

  revalidarObra();
  redirect("/painel/obra/publicacoes");
}

export async function atualizarPublicacao(
  id: string,
  _estadoAnterior: EstadoPublicacao,
  formData: FormData,
): Promise<EstadoPublicacao> {
  const dados = lerFormulario(formData);

  if (!dados.titulo || !dados.veiculo || !dados.ano) {
    return { ok: false, mensagem: "Título, veículo e ano são obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("publicacoes")
    .update(dados)
    .eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar a publicação." };
  }

  revalidarObra();
  return { ok: true, mensagem: "Salvo." };
}

export async function apagarPublicacao(
  id: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const supabase = await createClient();
  const { error } = await supabase.from("publicacoes").delete().eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao apagar a publicação." };
  }

  revalidarObra();
  redirect("/painel/obra/publicacoes");
}
