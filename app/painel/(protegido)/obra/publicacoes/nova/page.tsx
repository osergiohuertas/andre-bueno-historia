import Link from "next/link";
import { FormularioPublicacao } from "@/components/painel/FormularioPublicacao";
import { criarPublicacao } from "@/app/painel/(protegido)/obra/publicacoes/actions";

export default function NovaPublicacaoPage() {
  return (
    <div>
      <Link
        href="/painel/obra/publicacoes"
        className="meta text-chumbo hover:text-lacre"
      >
        ← Publicações
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Nova publicação</h1>

      <FormularioPublicacao action={criarPublicacao} />
    </div>
  );
}
