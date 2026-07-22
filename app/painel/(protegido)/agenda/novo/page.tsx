import Link from "next/link";
import { FormularioEvento } from "@/components/painel/FormularioEvento";
import { criarEvento } from "@/app/painel/(protegido)/agenda/actions";

export default function NovoEventoPage() {
  return (
    <div>
      <Link href="/painel/agenda" className="meta text-chumbo hover:text-lacre">
        ← Agenda
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Novo evento</h1>

      <FormularioEvento action={criarEvento} />
    </div>
  );
}
