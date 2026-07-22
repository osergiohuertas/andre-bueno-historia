import Link from "next/link";

const TONS = {
  claro: "border-borda text-chumbo hover:border-lacre hover:text-lacre",
  escuro: "border-paper/25 text-paper/60 hover:border-ouro hover:text-ouro",
};

export function ContaIcon({
  tom = "claro",
  className = "",
  onClick,
}: {
  tom?: "claro" | "escuro";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/conta/entrar"
      onClick={onClick}
      aria-label="Entrar ou criar conta"
      title="Entrar ou criar conta"
      className={`flex shrink-0 items-center justify-center rounded-full border transition-colors ${TONS[tom]} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.4-4.2 4.1-6.3 7-6.3s5.6 2.1 7 6.3" />
      </svg>
    </Link>
  );
}
