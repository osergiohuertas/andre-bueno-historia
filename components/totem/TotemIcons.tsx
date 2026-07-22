// Ícones de linha simples pro menu do totem — emoji rendera como sticker
// colorido (Apple/Noto) e destoa da identidade editorial, além de poder
// não renderizar em navegadores embarcados de quiosque. currentColor
// segue a cor do texto do botão (ink/ouro conforme o estado).

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconeLinhaDoTempo() {
  return (
    <Base>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Base>
  );
}

export function IconeMapa() {
  return (
    <Base>
      <path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </Base>
  );
}

export function IconePena() {
  return (
    <Base>
      <path d="M20 4c-5 0-11 4-13 10l-3 6 6-3C16 15 20 9 20 4z" />
      <path d="M9.5 14.5L4 20" />
    </Base>
  );
}

export function IconeAcervo() {
  return (
    <Base>
      <path d="M4 6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
      <path d="M4 10h16" />
    </Base>
  );
}
