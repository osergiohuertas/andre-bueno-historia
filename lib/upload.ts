import "server-only";
import { randomUUID } from "node:crypto";
import { FORMATOS_IMAGEM_ACEITOS, TAMANHO_MAXIMO_MB } from "@/lib/uploadConfig";

const BUCKET = "uploads";

/**
 * Upload de arquivos do painel (imagens e documentos) — bucket público no
 * Supabase Storage (mesmo projeto que já hospeda o banco, sem depender de
 * uma conta externa como a Cloudinary). Escrita sempre via service role
 * key, nunca exposta ao cliente; o bucket é público só para LEITURA.
 */
export async function uploadImagem(
  arquivo: Buffer,
  nomeArquivo: string,
  limiteMb: number = TAMANHO_MAXIMO_MB,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, erro: "Supabase não está configurado neste ambiente." };
  }

  const extensao = nomeArquivo.includes(".")
    ? nomeArquivo.slice(nomeArquivo.lastIndexOf("."))
    : "";
  const caminho = `andre-bueno/${randomUUID()}${extensao}`;
  const tipoConteudo = tipoMimePorExtensao(extensao);

  try {
    const resposta = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET}/${caminho}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": tipoConteudo,
        },
        body: new Uint8Array(arquivo),
      },
    );

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);

      if (erro?.error === "invalid_mime_type") {
        return {
          ok: false,
          erro: `Formato não aceito. Use: ${FORMATOS_IMAGEM_ACEITOS} (ou PDF, no caso de documentos).`,
        };
      }
      if (resposta.status === 413 || erro?.error === "Payload too large") {
        return {
          ok: false,
          erro: `Arquivo maior que o limite de ${limiteMb}MB.`,
        };
      }

      return {
        ok: false,
        erro: erro?.message ?? "Erro ao enviar imagem para o Supabase.",
      };
    }

    return {
      ok: true,
      url: `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${caminho}`,
    };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro desconhecido.";
    return { ok: false, erro: `Erro ao enviar imagem: ${mensagem}` };
  }
}

// Precisa bater exatamente com o `allowed_mime_types` do bucket "uploads"
// no Supabase Storage — um tipo aceito aqui mas fora da lista do bucket
// falha silenciosamente com 400 "InvalidMimeType" no upload.
function tipoMimePorExtensao(extensao: string): string {
  switch (extensao.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".avif":
      return "image/avif";
    case ".tif":
    case ".tiff":
      return "image/tiff";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}
