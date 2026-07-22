import Link from "next/link";

export function CardConexaoLivro({
  nota,
  tituloLivro,
}: {
  nota: string;
  tituloLivro: string;
}) {
  return (
    <aside className="my-10 border-l-2 border-ouro bg-paper-mid py-6 pr-6 pl-6">
      <p className="meta text-chumbo-lt">Nota do autor</p>
      <p className="mt-3 font-serif text-[17px] leading-relaxed text-chumbo italic">
        {nota}
      </p>
      <Link
        href="/livro"
        className="meta mt-4 inline-block text-lacre hover:underline"
      >
        Sobre {tituloLivro} →
      </Link>
    </aside>
  );
}
