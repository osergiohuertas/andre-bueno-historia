// Ícones de linha simples pra sidebar do painel — mesmo padrão de
// components/totem/TotemIcons.tsx: currentColor segue a cor do texto do
// link (chumbo/ouro conforme o estado ativo).

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconeArtigo() {
  return (
    <Base>
      <path d="M20 4c-5 0-11 4-13 10l-3 6 6-3C16 15 20 9 20 4z" />
      <path d="M9.5 14.5L4 20" />
    </Base>
  );
}

export function IconeOpiniao() {
  return (
    <Base>
      <path d="M21 12a8 8 0 1 1-3.6-6.7" />
      <path d="M17 3v5h5" />
    </Base>
  );
}

export function IconeSeries() {
  return (
    <Base>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 18l9 5 9-5" />
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

export function IconeAgenda() {
  return (
    <Base>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </Base>
  );
}

export function IconeMuseus() {
  return (
    <Base>
      <path d="M3 21h18" />
      <path d="M4 21V10l8-6 8 6v11" />
      <path d="M9 21v-7h6v7" />
    </Base>
  );
}

export function IconeObra() {
  return (
    <Base>
      <path d="M4 5a1.5 1.5 0 0 1 1.5-1.5H10V19H5.5A1.5 1.5 0 0 1 4 17.5z" />
      <path d="M10 3.5h4.5A1.5 1.5 0 0 1 16 5v12.5a1.5 1.5 0 0 1-1.5 1.5H10" />
      <path d="M16 6l3.2-1.1a1 1 0 0 1 1.3.9v11.4a1 1 0 0 1-.7 1L16 19.5" />
    </Base>
  );
}

export function IconeTotem() {
  return (
    <Base>
      <rect x="4" y="3" width="16" height="13" rx="1.5" />
      <path d="M9 21h6" />
      <path d="M12 16v5" />
    </Base>
  );
}

export function IconeSite() {
  return (
    <Base>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Base>
  );
}

export function IconeAnalytics() {
  return (
    <Base>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M2 20h20" />
    </Base>
  );
}
