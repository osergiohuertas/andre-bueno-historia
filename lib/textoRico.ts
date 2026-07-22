const TAGS_PERMITIDAS = new Set(["em", "strong"]);

/**
 * Único ponto de confiança para campos `texto_rico`. Remove qualquer marcação
 * que não seja <em> ou <strong> (sem atributos) — mesmo tags permitidas
 * perdem atributos. Usar tanto ao salvar quanto ao renderizar.
 */
export function sanitizarTextoRico(valor: string): string {
  return valor.replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tag: string) => {
    const tagLower = tag.toLowerCase();
    if (!TAGS_PERMITIDAS.has(tagLower)) return "";
    return match.startsWith("</") ? `</${tagLower}>` : `<${tagLower}>`;
  });
}
