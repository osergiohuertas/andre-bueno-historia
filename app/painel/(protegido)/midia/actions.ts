"use server";

import { revalidatePath } from "next/cache";
import { uploadImagem } from "@/lib/upload";
import { TAMANHO_MAXIMO_PDF_MB } from "@/lib/uploadConfig";
import { createAdminClient } from "@/lib/supabase/admin";
import { exigirAdmin } from "@/lib/painel-auth";

export type ResultadoEnvio = {
  enviados: { nome: string; url: string }[];
  erros: { nome: string; erro: string }[];
} | null;

export async function enviarArquivosAction(
  _estado: ResultadoEnvio,
  formData: FormData,
): Promise<ResultadoEnvio> {
  const guarda = await exigirAdmin();
  if (!guarda.ok) return { enviados: [], erros: [{ nome: "—", erro: guarda.mensagem }] };

  const arquivos = formData.getAll("arquivos").filter(
    (a): a is File => a instanceof File && a.size > 0,
  );
  const enviados: { nome: string; url: string }[] = [];
  const erros: { nome: string; erro: string }[] = [];

  for (const arquivo of arquivos) {
    const ehPdf = arquivo.name.toLowerCase().endsWith(".pdf");
    const resultado = await uploadImagem(
      Buffer.from(await arquivo.arrayBuffer()),
      arquivo.name,
      ehPdf ? TAMANHO_MAXIMO_PDF_MB : undefined,
    );
    if (resultado.ok) enviados.push({ nome: arquivo.name, url: resultado.url });
    else erros.push({ nome: arquivo.name, erro: resultado.erro });
  }

  revalidatePath("/painel/midia");
  return { enviados, erros };
}

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
