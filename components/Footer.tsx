import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ContaIcon } from "@/components/ui/ContaIcon";

const FOOTER_COLUNAS = [
  {
    titulo: "Conteúdo",
    links: [
      { href: "/artigos", label: "Todos os artigos" },
      { href: "/opiniao", label: "Opinião" },
      { href: "/linha-do-tempo", label: "Linha do tempo" },
      { href: "/acervo?secao=documentos", label: "Acervo de documentos" },
      { href: "/acervo?secao=atlas", label: "Atlas" },
    ],
  },
  {
    titulo: "Explorar",
    links: [
      { href: "/eventos", label: "Agenda" },
      { href: "/museus", label: "Museus" },
      { href: "/acervo?secao=livros", label: "Obra" },
      { href: "/livro", label: "O Livro" },
      { href: "/sobre", label: "Sobre" },
    ],
  },
];

type RodapeConfig = {
  descricao: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
};

const REDES_SOCIAIS: { chave: keyof RodapeConfig; label: string }[] = [
  { chave: "socialTwitter", label: "Tw" },
  { chave: "socialInstagram", label: "IG" },
  { chave: "socialYoutube", label: "YT" },
  { chave: "socialLinkedin", label: "LI" },
];

export function Footer({
  nome,
  rodape,
}: {
  nome: string;
  rodape: RodapeConfig;
}) {
  const ano = new Date().getFullYear();
  const redes = REDES_SOCIAIS.filter((rede) => rodape[rede.chave]);

  return (
    <footer className="mt-auto border-t border-ouro/40 bg-ink text-paper">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
        <div className="max-w-sm">
          <p className="font-display text-xl font-bold">{nome}</p>
          <p className="mt-4 font-serif text-sm font-light leading-relaxed text-paper/50">
            {rodape.descricao}
          </p>
          {redes.length > 0 && (
            <div className="mt-6 flex gap-3">
              {redes.map((rede) => (
                <a
                  key={rede.chave}
                  href={rodape[rede.chave]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center border border-paper/15 font-sans text-[11px] font-semibold text-paper/45 transition-colors hover:border-ouro hover:text-ouro"
                >
                  {rede.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {FOOTER_COLUNAS.map((coluna) => (
          <nav key={coluna.titulo}>
            <p className="meta mb-5 text-paper/35">{coluna.titulo}</p>
            <ul className="flex flex-col gap-3">
              {coluna.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-[13px] text-paper/60 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav>
          <p className="meta mb-5 text-paper/35">Conta</p>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2.5">
              <ContaIcon tom="escuro" className="h-6 w-6" />
              <Link
                href="/conta/entrar"
                className="font-sans text-[13px] font-semibold text-ouro transition-colors hover:text-paper"
              >
                Assinar carta
              </Link>
            </li>
            <li>
              <Link
                href="/conta/cadastro"
                className="font-sans text-[13px] text-paper/60 transition-colors hover:text-paper"
              >
                Criar conta de leitor
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <Container className="border-t border-paper/10 py-6">
        <p className="meta text-paper/25">
          &copy; {ano} {nome}. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
