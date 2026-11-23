"use server";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessaoPainel } from "@/lib/painel-auth";
import {
  FORMATOS_IMAGEM_ACEITOS,
  TAMANHO_MAXIMO_MB,
  TAMANHO_MAXIMO_PDF_MB,
  extensaoDe,
  tipoMimePorNome,
} from "@/lib/uploadConfig";

const BUCKET = "uploads";
const PASTA = "andre-bueno";

export type EnvioPreparado =
  | { ok: true; caminho: string; token: string; url: string; tipo: string }
  | { ok: false; erro: string };

/**
 * Autoriza um envio direto do navegador pro Supabase Storage (URL assinada
 * de uso único). O arquivo não passa pelo servidor do site — por isso não
 * esbarra no limite de 1 MB das server actions nem no de 4,5 MB do Vercel.
 * Só quem está logado no painel (admin ou colaborador) consegue autorizar.
 */
export async function prepararEnvioAction(
  nome: string,
  tamanhoBytes: number,
  somentePdf = false,
): Promise<EnvioPreparado> {
  const sessao = await getSessaoPainel();
  if (!sessao) return { ok: false, erro: "Sua sessão expirou — entre de novo no painel." };

  const tipo = tipoMimePorNome(nome);
  const ehPdf = tipo === "application/pdf";
  if (!tipo || (somentePdf && !ehPdf)) {
    return {
      ok: false,
      erro: somentePdf
        ? "Envie um arquivo PDF."
        : `Formato não aceito. Use: ${FORMATOS_IMAGEM_ACEITOS} (ou PDF, no caso de documentos).`,
    };
  }

  const limiteMb = ehPdf ? TAMANHO_MAXIMO_PDF_MB : TAMANHO_MAXIMO_MB;
  if (tamanhoBytes > limiteMb * 1024 * 1024) {
    return { ok: false, erro: `Arquivo maior que o limite de ${limiteMb}MB.` };
  }

  const caminho = `${PASTA}/${randomUUID()}${extensaoDe(nome)}`;
  const storage = createAdminClient().storage.from(BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(caminho);
  if (error || !data) return { ok: false, erro: "Não foi possível preparar o envio." };

  return {
    ok: true,
    caminho,
    token: data.token,
    url: storage.getPublicUrl(caminho).data.publicUrl,
    tipo,
  };
}
