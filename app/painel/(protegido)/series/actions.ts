"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type EstadoSerie = { ok: boolean; mensagem: string } | null;

function lerFormulario(formData: FormData) {
  const totalPartesBruto = formData.get("total_partes");
  const ordemBruto = formData.get("ordem");

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    numero: String(formData.get("numero") ?? "").trim(),
    nome: String(formData.get("nome") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    total_partes: totalPartesBruto ? Number(totalPartesBruto) : null,
    ordem: ordemBruto ? Number(ordemBruto) : null,
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarSerie(
  _estadoAnterior: EstadoSerie,
  formData: FormData,
): Promise<EstadoSerie> {
  const dados = lerFormulario(formData);

  if (!dados.slug || !dados.numero || !dados.nome) {
    return { ok: false, mensagem: "Slug, número e nome são obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("series").insert(dados);

  if (error) {
    return {
      ok: false,
      mensagem: error.code === "23505" ? "Já existe uma série com esse slug." : "Erro ao criar a série.",
    };
  }

  revalidatePath("/painel/series");
  revalidatePath("/");
  redirect("/painel/series");
}

export async function atualizarSerie(
  id: string,
  _estadoAnterior: EstadoSerie,
  formData: FormData,
): Promise<EstadoSerie> {
  const dados = lerFormulario(formData);

  if (!dados.slug || !dados.numero || !dados.nome) {
    return { ok: false, mensagem: "Slug, número e nome são obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("series").update(dados).eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar a série." };
  }

  revalidatePath("/painel/series");
  revalidatePath("/");
  return { ok: true, mensagem: "Salvo." };
}

export async function apagarSerie(
  id: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const supabase = await createClient();
  const { error } = await supabase.from("series").delete().eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao apagar a série." };
  }

  revalidatePath("/painel/series");
  revalidatePath("/");
  redirect("/painel/series");
}
