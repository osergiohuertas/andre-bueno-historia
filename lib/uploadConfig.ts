// Espelha o `allowed_mime_types`/`file_size_limit` configurados no bucket
// "uploads" do Supabase Storage (ver lib/upload.ts) — arquivo sem
// "server-only" de propósito, pra poder ser importado tanto pelas actions
// do servidor quanto pelos campos de upload no cliente, que mostram essa
// mesma informação como ajuda antes de escolher o arquivo.
export const FORMATOS_IMAGEM_ACEITOS = "JPEG, PNG, WebP, GIF, BMP, AVIF ou TIFF";
export const TAMANHO_MAXIMO_MB = 20;

// Limite de PDF pedido pelo André é 150MB, mas o bucket não pode passar do
// teto global de upload do projeto Supabase (testado: 50MB passa, 60MB+
// falha com 413 — é o limite de plano, só sobe via Dashboard → Project
// Settings → Storage). Refletir aqui o que de fato funciona hoje.
export const TAMANHO_MAXIMO_PDF_MB = 50;

const MIME_POR_EXTENSAO: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".pdf": "application/pdf",
};

export function extensaoDe(nome: string): string {
  const i = nome.lastIndexOf(".");
  return i === -1 ? "" : nome.slice(i).toLowerCase();
}

/**
 * Precisa bater com o `allowed_mime_types` do bucket "uploads" — tipo fora
 * da lista é recusado pelo Storage. `null` = formato não aceito.
 */
export function tipoMimePorNome(nome: string): string | null {
  return MIME_POR_EXTENSAO[extensaoDe(nome)] ?? null;
}
