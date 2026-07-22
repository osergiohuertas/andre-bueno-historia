import Link from "next/link";
import { sair } from "@/app/conta/actions";

export default function ContaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-paper text-ink">
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/conta" className="font-display text-lg">
              Minha conta
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/conta/biblioteca" className="meta text-chumbo hover:text-lacre">
                Biblioteca
              </Link>
              <Link href="/conta/configuracoes" className="meta text-chumbo hover:text-lacre">
                Configurações
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="meta text-chumbo-lt hover:text-lacre">
              Ver o site
            </Link>
            <form action={sair}>
              <button type="submit" className="meta text-chumbo-lt hover:text-lacre">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
