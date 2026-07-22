import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Cliente sem cookies/sessão — só para leituras públicas (site_config,
 * series) que qualquer visitante anônimo já pode ler via RLS. Usar isso
 * em vez de lib/supabase/server.ts nessas leituras é o que permite essas
 * páginas continuarem estáticas: o server.ts chama cookies() do
 * next/headers, e isso sozinho força a página inteira a virar dinâmica —
 * mesmo quando o dado lido não depende de sessão nenhuma.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
