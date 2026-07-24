"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";

export type EstadoDestino = { ok: boolean; mensagem: string } | null;

function revalidarDestinos(slug?: string) {
  revalidatePath("/painel/destinos");
  revalidatePath("/destinos");
  if (slug) revalidatePath(`/destinos/${slug}`);
}

function lerFormulario(formData: FormData) {
  const lat = Number(formData.get("lat") ?? 0);
  const lng = Number(formData.get("lng") ?? 0);

  return {
    nome: String(formData.get("nome") ?? "").trim(),
    cidade: String(formData.get("cidade") ?? "").trim(),
    endereco: String(formData.get("endereco") ?? "").trim(),
    coordenadas: { lat, lng },
    horario: String(formData.get("horario") ?? "").trim(),
    ingresso: String(formData.get("ingresso") ?? "").trim(),
    telefone: String(formData.get("telefone") ?? "").trim() || null,
    site: String(formData.get("site") ?? "").trim() || null,
    foto: String(formData.get("foto") ?? "").trim() || null,
    tipologia: String(formData.get("tipologia") ?? "").trim(),
    data_verificacao: String(formData.get("data_verificacao") ?? ""),
    texto_autoral: String(formData.get("texto_autoral") ?? "").trim() || null,
    publicado: formData.get("publicado") === "on",
  };
}

export async function criarDestino(
  _estadoAnterior: EstadoDestino,
  formData: FormData,
): Promise<EstadoDestino> {
  const dados = lerFormulario(formData);

  if (
    !dados.nome ||
    !dados.cidade ||
    !dados.endereco ||
    !dados.horario ||
    !dados.ingresso ||
    !dados.tipologia ||
    !dados.data_verificacao
  ) {
    return { ok: false, mensagem: "Preencha todos os campos obrigatórios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("destinos").insert({
    ...dados,
    slug: gerarSlug(dados.nome),
  });

  if (error) {
    return {
      ok: false,
      mensagem:
        error.code === "23505"
          ? "Já existe um destino com um nome muito parecido."
          : "Erro ao criar o destino.",
    };
  }

  revalidarDestinos();
  redirect("/painel/destinos");
}

export async function atualizarDestino(
  id: string,
  _estadoAnterior: EstadoDestino,
  formData: FormData,
): Promise<EstadoDestino> {
  const dados = lerFormulario(formData);

  if (
    !dados.nome ||
    !dados.cidade ||
    !dados.endereco ||
    !dados.horario ||
    !dados.ingresso ||
    !dados.tipologia ||
    !dados.data_verificacao
  ) {
    return { ok: false, mensagem: "Preencha todos os campos obrigatórios." };
  }

  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("destinos")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("destinos").update(dados).eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar o destino." };
  }

  revalidarDestinos(atual?.slug);
  return { ok: true, mensagem: "Salvo." };
}

export async function apagarDestino(
  id: string,
): Promise<{ ok: boolean; mensagem: string } | void> {
  const supabase = await createClient();

  // Apaga primeiro os vínculos com artigos (evita violar FK caso não haja
  // cascade configurado na migration).
  await supabase.from("destino_artigos").delete().eq("destino_id", id);

  const { error } = await supabase.from("destinos").delete().eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao apagar o destino." };
  }

  revalidarDestinos();
  redirect("/painel/destinos");
}

export async function alternarVinculoArtigo(
  destinoId: string,
  artigoSlug: string,
  vincular: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();

  if (vincular) {
    await supabase
      .from("destino_artigos")
      .upsert(
        { destino_id: destinoId, artigo_slug: artigoSlug },
        { onConflict: "destino_id,artigo_slug" },
      );
  } else {
    await supabase
      .from("destino_artigos")
      .delete()
      .eq("destino_id", destinoId)
      .eq("artigo_slug", artigoSlug);
  }

  const { data: destino } = await supabase
    .from("destinos")
    .select("slug")
    .eq("id", destinoId)
    .single();

  revalidarDestinos(destino?.slug);
  return { ok: true };
}
