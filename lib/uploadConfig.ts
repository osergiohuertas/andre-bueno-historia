// Espelha o `allowed_mime_types`/`file_size_limit` configurados no bucket
// "uploads" do Supabase Storage (ver lib/upload.ts) — arquivo sem
// "server-only" de propósito, pra poder ser importado tanto pelas actions
// do servidor quanto pelos campos de upload no cliente, que mostram essa
// mesma informação como ajuda antes de escolher o arquivo.
export const FORMATOS_IMAGEM_ACEITOS = "JPEG, PNG, WebP, GIF, BMP, AVIF ou TIFF";
export const TAMANHO_MAXIMO_MB = 20;
