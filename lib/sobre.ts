import { getConfigGrupo } from "@/lib/config";
import { SOBRE_DEFAULTS } from "@/data/sobre.defaults";

export async function getSobreConfig() {
  const cfg = await getConfigGrupo("sobre");
  const pega = (chave: string, fallback: string) => cfg[chave] || fallback;

  return {
    manifesto: pega("sobre.manifesto", SOBRE_DEFAULTS.manifesto),
    trajetoria: pega("sobre.trajetoria", SOBRE_DEFAULTS.trajetoria),
    metodologia: pega("sobre.metodologia", SOBRE_DEFAULTS.metodologia),
    fotoUrl: pega("sobre.foto_url", SOBRE_DEFAULTS.fotoUrl),
    emailContato: pega("sobre.email_contato", SOBRE_DEFAULTS.emailContato),
  };
}
