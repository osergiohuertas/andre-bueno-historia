import Link from "next/link";

const GRUPOS = [
  { id: "identidade", nome: "Identidade", descricao: "Nome e tagline do site." },
  { id: "home", nome: "Home", descricao: "Hero, stats e newsletter da página inicial." },
  { id: "sobre", nome: "Sobre", descricao: "Manifesto, trajetória e metodologia." },
  { id: "livro", nome: "Livro", descricao: "Vitrine de /livro e o link da Amazon." },
  { id: "rodape", nome: "Rodapé", descricao: "Descrição e redes sociais." },
  { id: "seo", nome: "SEO", descricao: "Título e descrição padrão do site." },
];

export default function ConteudoPage() {
  return (
    <div>
      <p className="meta text-lacre">Painel</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Conteúdo</h1>
      <p className="mt-2 font-serif text-chumbo">
        Você edita conteúdo, nunca forma — cor, fonte e espaçamento não estão
        aqui.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {GRUPOS.map((grupo) => (
          <Link
            key={grupo.id}
            href={`/painel/conteudo/${grupo.id}`}
            className="border border-borda p-6 transition-colors hover:border-lacre"
          >
            <span className="font-display text-xl text-ink">
              {grupo.nome}
            </span>
            <p className="mt-2 font-serif text-sm text-chumbo">
              {grupo.descricao}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
