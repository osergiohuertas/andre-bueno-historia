// Atalho da tela de edição para a página pública. Só aparece para conteúdo
// publicado — rascunho não tem página no ar.
export function VerNoSite({ href, publicado }: { href: string; publicado: boolean }) {
  if (!publicado) {
    return <span className="meta text-chumbo-lt">Rascunho · não está no site</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="meta text-chumbo hover:text-lacre"
    >
      Ver no site ↗
    </a>
  );
}
