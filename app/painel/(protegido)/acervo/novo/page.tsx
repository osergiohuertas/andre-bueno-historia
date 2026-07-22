import Link from "next/link";
import { FormularioAcervo } from "@/components/painel/FormularioAcervo";
import { criarAcervo } from "@/app/painel/(protegido)/acervo/actions";
import { contarAcervoPorPeriodo } from "@/lib/acervo";

export default function NovoAcervoPage() {
  return (
    <div>
      <Link href="/painel/acervo" className="meta text-chumbo hover:text-lacre">
        ← Acervo documental
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">
        Novo item de acervo
      </h1>

      <FormularioAcervo action={criarAcervo} contagens={contarAcervoPorPeriodo()} />
    </div>
  );
}
