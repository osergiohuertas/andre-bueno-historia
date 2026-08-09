"use server";

import { createClient } from "@/lib/supabase/server";
import { sanitizarTextoRico } from "@/lib/textoRico";
import { revalidarPorGrupo } from "@/lib/revalidacao";
import { uploadImagem } from "@/lib/upload";

export type EstadoSalvar = { ok: boolean; mensagem: string } | null;

export async function uploadImagemCampoAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return { ok: false, erro: "Nenhum arquivo enviado." };
  }

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  return uploadImagem(buffer, arquivo.name);
}

export async function salvarGrupo(
  grupo: string,
  _estadoAnterior: EstadoSalvar,
  formData: FormData,
): Promise<EstadoSalvar> {
  const supabase = await createClient();

  const { data: campos, error: erroCampos } = await supabase
    .from("site_config")
    .select("chave, tipo, max_chars")
    .eq("grupo", grupo);

  if (erroCampos || !campos) {
    return { ok: false, mensagem: "Não foi possível carregar os campos." };
  }

  for (const campo of campos) {
    if (campo.tipo === "booleano") {
      const marcado = formData.get(campo.chave) === "on";
      const { error } = await supabase
        .from("site_config")
        .update({ valor: marcado ? "true" : "false" })
        .eq("chave", campo.chave);
      if (error) {
        return { ok: false, mensagem: `Erro ao salvar "${campo.chave}".` };
      }
      continue;
    }

    const bruto = formData.get(campo.chave);
    if (bruto === null) continue;

    let valor = String(bruto);
    if (campo.max_chars) valor = valor.slice(0, campo.max_chars);
    if (campo.tipo === "texto_rico") valor = sanitizarTextoRico(valor);

    const { error } = await supabase
      .from("site_config")
      .update({ valor })
      .eq("chave", campo.chave);

    if (error) {
      return { ok: false, mensagem: `Erro ao salvar "${campo.chave}".` };
    }
  }

  revalidarPorGrupo(grupo);
  return { ok: true, mensagem: "Salvo." };
}

/**
 * Reverte um campo pro `valor` passado — a página já leu o histórico
 * inteiro (`site_config_history`) e mostra cada versão com seu próprio
 * botão de reverter, então a action só precisa gravar o valor escolhido
 * (o próprio update já vira uma entrada nova no histórico via trigger).
 */
export async function reverterCampo(chave: string, valor: string) {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("site_config")
    .select("grupo")
    .eq("chave", chave)
    .single();

  await supabase.from("site_config").update({ valor }).eq("chave", chave);

  if (config) revalidarPorGrupo(config.grupo);
}
