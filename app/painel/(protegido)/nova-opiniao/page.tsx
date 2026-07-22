import Link from "next/link";
import { FormularioOpiniao } from "@/components/painel/FormularioOpiniao";
import { getArtigosPublicados } from "@/lib/artigos";
import { PERIODOS } from "@/data/periodos";

export default function NovaOpiniaoPage() {
  const artigos = getArtigosPublicados().map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
  }));
  const periodos = PERIODOS.map((p) => ({ id: p.id, label: p.label }));

  return (
    <div>
      <Link href="/painel/conteudo" className="meta text-chumbo hover:text-lacre">
        ← Painel
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Nova opinião</h1>
      <p className="mt-3 max-w-xl font-serif text-sm text-chumbo">
        Peça editorial — a sua voz, com contexto histórico. Diferente do artigo:
        sem período obrigatório, não entra na linha do tempo nem no atlas.
      </p>

      <FormularioOpiniao periodos={periodos} artigos={artigos} />
    </div>
  );
}
