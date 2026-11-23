"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { exigirAdmin } from "@/lib/painel-auth";

export async function apagarArquivoAction(
  caminho: string,
): Promise<{ ok: boolean; mensagem: string }> {
  const guarda = await exigirAdmin();
  if (!guarda.ok) return guarda;

  const { error } = await createAdminClient().storage.from("uploads").remove([caminho]);
  if (error) return { ok: false, mensagem: "Não foi possível apagar." };

  revalidatePath("/painel/midia");
  return { ok: true, mensagem: "Apagado." };
}
