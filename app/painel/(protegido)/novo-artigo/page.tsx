import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { contarArtigosPorPeriodo } from "@/lib/artigos";
import { NovoArtigoWizard } from "@/components/painel/editor/NovoArtigoWizard";

export default async function NovoArtigoPage() {
  const supabase = await createClient();
  const { data: series } = await supabase
    .from("series")
    .select("slug, nome")
    .order("ordem", { ascending: true });

  const contagens = contarArtigosPorPeriodo();

  return (
    <div>
      <Link href="/painel/conteudo" className="meta text-chumbo hover:text-lacre">
        ← Painel
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo artigo</h1>

      <NovoArtigoWizard
        series={series ?? []}
        contagens={contagens}
      />
    </div>
  );
}
