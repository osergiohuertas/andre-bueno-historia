import Link from "next/link";
import { FormularioGlossario } from "@/components/painel/FormularioGlossario";
import { criarTermoGlossario } from "@/app/painel/(protegido)/glossario/actions";

export default function NovoTermoGlossarioPage() {
  return (
    <div>
      <Link
        href="/painel/glossario"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Glossário
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo termo</h1>

      <FormularioGlossario action={criarTermoGlossario} />
    </div>
  );
}
