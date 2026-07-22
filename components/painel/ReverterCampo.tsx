import { reverterCampo } from "@/app/painel/(protegido)/conteudo/actions";

export function ReverterCampo({
  chave,
  valorAnterior,
}: {
  chave: string;
  valorAnterior: string;
}) {
  const reverter = reverterCampo.bind(null, chave);

  return (
    <form action={reverter} className="mt-1 flex items-center gap-2">
      <p className="truncate font-serif text-xs text-chumbo-lt">
        Valor anterior: &ldquo;{valorAnterior.slice(0, 60)}
        {valorAnterior.length > 60 ? "…" : ""}&rdquo;
      </p>
      <button
        type="submit"
        className="meta shrink-0 text-lacre hover:underline"
      >
        Reverter
      </button>
    </form>
  );
}
