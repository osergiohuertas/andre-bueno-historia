import { getConfigGrupo } from "@/lib/config";
import { IDENTIDADE_DEFAULTS } from "@/data/identidade.defaults";

export async function getIdentidadeConfig() {
  const cfg = await getConfigGrupo("identidade");
  const pega = (chave: string, fallback: string) => cfg[chave] ?? fallback;

  return {
    nome: pega("identidade.nome", IDENTIDADE_DEFAULTS.nome),
    tagline: pega("identidade.tagline", IDENTIDADE_DEFAULTS.tagline),
  };
}
