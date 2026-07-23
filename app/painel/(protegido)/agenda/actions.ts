"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";

export type EstadoEvento = { ok: boolean; mensagem: string } | null;

function revalidarEventos() {
  revalidatePath("/painel/agenda");
  revalidatePath("/eventos");
  revalidatePath("/eventos/cultural");
  revalidatePath("/eventos/academico");
  revalidatePath("/eventos/com-andre");
  revalidatePath("/eventos/arquivo");
}

function lerFormulario(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim(),
    data_inicio: String(formData.get("data_inicio") ?? ""),
    data_fim: String(formData.get("data_fim") ?? ""),
    natureza: String(formData.get("natureza") ?? "cultural") as
      | "cultural"
      | "academico",
    participacao: String(formData.get("participacao") ?? "curadoria") as
      | "curadoria"
      | "com_andre",
    local: String(formData.get("local") ?? "").trim(),
    cidade: String(formData.get("cidade") ?? "").trim(),
    endereco: String(formData.get("endereco") ?? "").trim() || null,
    organizador: String(formData.get("organizador") ?? "").trim(),
    link_inscricao: String(formData.get("link_inscricao") ?? "").trim() || null,
    imagem_capa: String(formData.get("imagem_capa") ?? "").trim() || null,
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarEvento(
  _estadoAnterior: EstadoEvento,
  formData: FormData,
): Promise<EstadoEvento> {
  const dados = lerFormulario(formData);

  if (
    !dados.titulo ||
    !dados.descricao ||
    !dados.data_inicio ||
    !dados.data_fim ||
    !dados.local ||
    !dados.cidade ||
    !dados.organizador
  ) {
    return { ok: false, mensagem: "Preencha todos os campos obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("eventos").insert({
    ...dados,
    slug: gerarSlug(dados.titulo),
    coordenadas: null,
  });

  if (error) {
    return {
      ok: false,
      mensagem:
        error.code === "23505"
          ? "Já existe um evento com um título muito parecido."
          : "Erro ao criar o evento.",
    };
  }

  revalidarEventos();
  redirect("/painel/agenda");
}

export async function atualizarEvento(
  id: string,
  _estadoAnterior: EstadoEvento,
  formData: FormData,
): Promise<EstadoEvento> {
  const dados = lerFormulario(formData);

  if (
    !dados.titulo ||
    !dados.descricao ||
    !dados.data_inicio ||
    !dados.data_fim ||
    !dados.local ||
    !dados.cidade ||
    !dados.organizador
  ) {
    return { ok: false, mensagem: "Preencha todos os campos obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("eventos")
    .update(dados)
    .eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar o evento." };
  }

  revalidarEventos();
  return { ok: true, mensagem: "Salvo." };
}

export async function apagarEvento(
  id: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const supabase = await createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao apagar o evento." };
  }

  revalidarEventos();
  redirect("/painel/agenda");
}
