"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImagem } from "@/lib/upload";

export type EstadoMidia = { ok: boolean; mensagem: string } | null;

function revalidarMidia(tipo: "video" | "foto") {
  const rota = tipo === "video" ? "videos" : "fotos";
  revalidatePath(`/painel/obra/${rota}`);
  revalidatePath("/acervo");
}

function lerFormulario(formData: FormData, tipo: "video" | "foto") {
  return {
    tipo,
    titulo: String(formData.get("titulo") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    categoria: String(formData.get("categoria") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim(),
    credito: String(formData.get("credito") ?? "").trim() || null,
    data: String(formData.get("data") ?? "").trim() || null,
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarMidia(
  tipo: "video" | "foto",
  _estadoAnterior: EstadoMidia,
  formData: FormData,
): Promise<EstadoMidia> {
  const dados = lerFormulario(formData, tipo);

  if (!dados.titulo) {
    return { ok: false, mensagem: "Título é obrigatório." };
  }

  let url = dados.url;

  if (tipo === "foto") {
    const arquivo = formData.get("arquivo");
    if (arquivo instanceof File && arquivo.size > 0) {
      const buffer = Buffer.from(await arquivo.arrayBuffer());
      const resultado = await uploadImagem(buffer, arquivo.name);
      if (!resultado.ok) {
        return { ok: false, mensagem: resultado.erro };
      }
      url = resultado.url;
    }
  }

  if (!url) {
    return {
      ok: false,
      mensagem:
        tipo === "video"
          ? "Cole a URL do vídeo (YouTube ou Vimeo)."
          : "Envie uma foto.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("acervo_midia")
    .insert({ ...dados, url });

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar." };
  }

  revalidarMidia(tipo);
  redirect(`/painel/obra/${tipo === "video" ? "videos" : "fotos"}`);
}

export async function atualizarMidia(
  id: string,
  tipo: "video" | "foto",
  _estadoAnterior: EstadoMidia,
  formData: FormData,
): Promise<EstadoMidia> {
  const dados = lerFormulario(formData, tipo);

  if (!dados.titulo) {
    return { ok: false, mensagem: "Título é obrigatório." };
  }

  let url = dados.url || undefined;

  if (tipo === "foto") {
    const arquivo = formData.get("arquivo");
    if (arquivo instanceof File && arquivo.size > 0) {
      const buffer = Buffer.from(await arquivo.arrayBuffer());
      const resultado = await uploadImagem(buffer, arquivo.name);
      if (!resultado.ok) {
        return { ok: false, mensagem: resultado.erro };
      }
      url = resultado.url;
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("acervo_midia")
    .update({ ...dados, ...(url ? { url } : {}) })
    .eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar." };
  }

  revalidarMidia(tipo);
  return { ok: true, mensagem: "Salvo." };
}

export async function apagarMidia(
  id: string,
  tipo: "video" | "foto",
): Promise<{ ok: boolean; mensagem: string } | void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("acervo_midia")
    .delete()
    .eq("id", id)
    .eq("tipo", tipo);

  if (error) {
    return { ok: false, mensagem: "Erro ao apagar." };
  }

  revalidarMidia(tipo);
  redirect(`/painel/obra/${tipo === "video" ? "videos" : "fotos"}`);
}
