import Link from "next/link";
import { FormularioMuseu } from "@/components/painel/FormularioMuseu";
import { criarMuseu } from "@/app/painel/(protegido)/museus/actions";

export default function NovoMuseuPage() {
  return (
    <div>
      <Link href="/painel/museus" className="meta text-chumbo hover:text-lacre">
        ← Museus
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo museu</h1>

      <FormularioMuseu action={criarMuseu} />
    </div>
  );
}
