import Link from "next/link";
import { FormularioSerie } from "@/components/painel/FormularioSerie";
import { criarSerie } from "@/app/painel/(protegido)/series/actions";

export default function NovaSeriePage() {
  return (
    <div>
      <Link href="/painel/series" className="meta text-chumbo hover:text-lacre">
        ← Séries
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Nova série</h1>

      <FormularioSerie action={criarSerie} />
    </div>
  );
}
