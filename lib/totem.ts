import { createPublicClient } from "@/lib/supabase/public";
import { getArtigosPublicados } from "@/lib/artigos";
import type { PeriodoId } from "@/data/periodos";

export type FraseAtracao = {
  periodo: PeriodoId | null;
  texto: string;
  imagemUrl: string | null;
};

export type TotemConfig = {
  id: string | null;
  nomeLocal: string;
  resetSegundos: number;
  frases: FraseAtracao[];
  periodosDestaque: PeriodoId[];
  utmCampaign: string | null;
};

const CONFIG_PADRAO: Omit<TotemConfig, "frases"> = {
  id: null,
  nomeLocal: "Totem",
  resetSegundos: 45,
  periodosDestaque: [],
  utmCampaign: null,
};

/**
 * Config do totem ativo. Se a tabela não existir ainda ou não houver linha
 * `ativo = true`, cai nos defaults de código — o totem nunca fica quebrado
 * por falta de config (mesma filosofia de getConfigGrupo).
 */
export async function getTotemConfig(): Promise<TotemConfig> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("totem_config")
      .select("*")
      .eq("ativo", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) return { ...CONFIG_PADRAO, frases: [] };

    return {
      id: data.id,
      nomeLocal: data.nome_local || CONFIG_PADRAO.nomeLocal,
      // ?? (não ||): 0 é um valor válido de reset_segundos, não deve cair
      // no default só por ser falsy — só null/undefined caem no default.
      resetSegundos: data.reset_segundos ?? CONFIG_PADRAO.resetSegundos,
      frases: (data.frases ?? []).map((f) => ({
        periodo: (f.periodo as PeriodoId) || null,
        texto: f.texto,
        imagemUrl: f.imagem_url || null,
      })),
      periodosDestaque: (data.periodos_destaque ?? []) as PeriodoId[],
      utmCampaign: data.utm_campaign,
    };
  } catch {
    return { ...CONFIG_PADRAO, frases: [] };
  }
}

/**
 * Frases do attract loop. Se o André não cadastrou nenhuma no
 * /painel/totem, usa os artigos publicados de maior destaque (mais
 * recentes) como fallback — o totem nunca fica em branco.
 */
export function getFrasesComFallback(config: TotemConfig): FraseAtracao[] {
  if (config.frases.length > 0) return config.frases;

  return getArtigosPublicados()
    .slice(0, 6)
    .map((a) => ({
      periodo: a.periodo,
      texto: a.excerpt,
      imagemUrl: a.imagemCapa ?? null,
    }));
}
