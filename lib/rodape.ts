import { getConfigGrupo } from "@/lib/config";
import { RODAPE_DEFAULTS } from "@/data/rodape.defaults";

export async function getRodapeConfig() {
  const cfg = await getConfigGrupo("rodape");
  const pega = (chave: string, fallback: string) => cfg[chave] ?? fallback;

  return {
    descricao: pega("rodape.descricao", RODAPE_DEFAULTS.descricao),
    socialTwitter: pega(
      "rodape.social.twitter",
      RODAPE_DEFAULTS.socialTwitter,
    ),
    socialInstagram: pega(
      "rodape.social.instagram",
      RODAPE_DEFAULTS.socialInstagram,
    ),
    socialYoutube: pega(
      "rodape.social.youtube",
      RODAPE_DEFAULTS.socialYoutube,
    ),
    socialLinkedin: pega(
      "rodape.social.linkedin",
      RODAPE_DEFAULTS.socialLinkedin,
    ),
  };
}
