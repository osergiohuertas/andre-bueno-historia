import { getConfigGrupo } from "@/lib/config";
import { HOME_DEFAULTS } from "@/data/home.defaults";

export async function getHomeConfig() {
  const cfg = await getConfigGrupo("home");
  const pega = (chave: string, fallback: string) => cfg[chave] ?? fallback;

  return {
    heroEyebrow: pega("home.hero.eyebrow", HOME_DEFAULTS.heroEyebrow),
    heroTitulo: pega("home.hero.titulo", HOME_DEFAULTS.heroTitulo),
    heroDescricao: pega("home.hero.descricao", HOME_DEFAULTS.heroDescricao),
    ctaPrimario: pega("home.hero.cta_primario", HOME_DEFAULTS.ctaPrimario),
    ctaSecundario: pega(
      "home.hero.cta_secundario",
      HOME_DEFAULTS.ctaSecundario,
    ),
    stat1Label: pega("home.stats.1.label", HOME_DEFAULTS.stat1Label),
    stat2Label: pega("home.stats.2.label", HOME_DEFAULTS.stat2Label),
    stat3Label: pega("home.stats.3.label", HOME_DEFAULTS.stat3Label),
    newsletterTitulo: pega(
      "home.newsletter.titulo",
      HOME_DEFAULTS.newsletterTitulo,
    ),
    newsletterCorpo: pega(
      "home.newsletter.corpo",
      HOME_DEFAULTS.newsletterCorpo,
    ),
  };
}
