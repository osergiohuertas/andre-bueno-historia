import Link from "next/link";
import { FormularioDestino } from "@/components/painel/FormularioDestino";
import { criarDestino } from "@/app/painel/(protegido)/destinos/actions";

export default function NovoDestinoPage() {
  return (
    <div>
      <Link href="/painel/destinos" className="meta text-chumbo hover:text-lacre">
        ← Destinos
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo destino</h1>

      <FormularioDestino action={criarDestino} />
    </div>
  );
}
