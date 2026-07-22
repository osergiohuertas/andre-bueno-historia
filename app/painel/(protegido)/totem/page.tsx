import { createClient } from "@/lib/supabase/server";
import { FormularioTotem } from "@/components/painel/FormularioTotem";
import { salvarTotemConfig } from "@/app/painel/(protegido)/totem/actions";

export default async function TotemPainelPage() {
  const supabase = await createClient();
  const { data: totem } = await supabase
    .from("totem_config")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Modo Totem</h1>
      <p className="mt-2 font-serif text-sm text-chumbo-lt">
        Configuração do totem físico de quiosque (/modototem) — sem código, do mesmo
        jeito que o resto do site.
      </p>

      <FormularioTotem totem={totem ?? undefined} action={salvarTotemConfig} />
    </div>
  );
}
