"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";

export type EstadoMuseu = { ok: boolean; mensagem: string } | null;

function revalidarMuseus(slug?: string) {
  revalidatePath("/painel/museus");
  revalidatePath("/museus");
  if (slug) revalidatePath(`/museus/${slug}`);
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

export async function criarMuseu(
  _estadoAnterior: EstadoMuseu,
  formData: FormData,
): Promise<EstadoMuseu> {
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
  const { error } = await supabase.from("museus").insert({
    ...dados,
    slug: gerarSlug(dados.nome),
  });

  if (error) {
    return {
      ok: false,
      mensagem:
        error.code === "23505"
          ? "Já existe um museu com um nome muito parecido."
          : "Erro ao criar o museu.",
    };
  }

  revalidarMuseus();
  redirect("/painel/museus");
}

export async function atualizarMuseu(
  id: string,
  _estadoAnterior: EstadoMuseu,
  formData: FormData,
): Promise<EstadoMuseu> {
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
    .from("museus")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("museus").update(dados).eq("id", id);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar o museu." };
  }

  revalidarMuseus(atual?.slug);
  return { ok: true, mensagem: "Salvo." };
}

export async function alternarVinculoArtigo(
  museuId: string,
  artigoSlug: string,
  vincular: boolean,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();

  if (vincular) {
    await supabase
      .from("museu_artigos")
      .upsert(
        { museu_id: museuId, artigo_slug: artigoSlug },
        { onConflict: "museu_id,artigo_slug" },
      );
  } else {
    await supabase
      .from("museu_artigos")
      .delete()
      .eq("museu_id", museuId)
      .eq("artigo_slug", artigoSlug);
  }

  const { data: museu } = await supabase
    .from("museus")
    .select("slug")
    .eq("id", museuId)
    .single();

  revalidarMuseus(museu?.slug);
  return { ok: true };
}
