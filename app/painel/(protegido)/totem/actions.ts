"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PeriodoId } from "@/data/periodos";

export type EstadoTotem = { ok: boolean; mensagem: string } | null;

function revalidarTotem() {
  revalidatePath("/painel/totem");
  revalidatePath("/modototem");
}

function lerFrases(formData: FormData): { periodo: PeriodoId | ""; texto: string; imagem_url: string }[] {
  const bruto = String(formData.get("frases") ?? "[]");
  try {
    const frases = JSON.parse(bruto);
    if (!Array.isArray(frases)) return [];
    return frases.filter((f) => f && typeof f.texto === "string" && f.texto.trim() !== "");
  } catch {
    return [];
  }
}

export async function salvarTotemConfig(
  _estadoAnterior: EstadoTotem,
  formData: FormData,
): Promise<EstadoTotem> {
  const nomeLocal = String(formData.get("nome_local") ?? "").trim();
  const resetSegundos = Number(formData.get("reset_segundos") ?? 45);
  const utmCampaign = String(formData.get("utm_campaign") ?? "").trim();
  const ativo = formData.get("ativo") === "on";
  const frases = lerFrases(formData);

  if (!nomeLocal) {
    return { ok: false, mensagem: "Nome do local é obrigatório." };
  }
  if (!Number.isFinite(resetSegundos) || resetSegundos < 10) {
    return { ok: false, mensagem: "Tempo de reset precisa ser pelo menos 10 segundos." };
  }

  const supabase = await createClient();
  const dados = {
    nome_local: nomeLocal,
    reset_segundos: resetSegundos,
    utm_campaign: utmCampaign || null,
    ativo,
    frases,
  };

  const { data: existente } = await supabase
    .from("totem_config")
    .select("id")
    .limit(1)
    .maybeSingle();

  const { error } = existente
    ? await supabase.from("totem_config").update(dados).eq("id", existente.id)
    : await supabase.from("totem_config").insert(dados);

  if (error) {
    return { ok: false, mensagem: "Erro ao salvar a configuração do totem." };
  }

  revalidarTotem();
  return { ok: true, mensagem: "Salvo." };
}
