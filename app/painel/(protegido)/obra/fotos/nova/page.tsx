import Link from "next/link";
import { FormularioMidia } from "@/components/painel/FormularioMidia";
import { criarMidia } from "@/app/painel/(protegido)/obra/midia-actions";

export default function NovaFotoPage() {
  return (
    <div>
      <Link
        href="/painel/obra/fotos"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Fotos
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Nova foto</h1>

      <FormularioMidia tipo="foto" action={criarMidia.bind(null, "foto")} />
    </div>
  );
}
