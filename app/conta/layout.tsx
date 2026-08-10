import type { Metadata } from "next";

// Cobre /conta/entrar, /conta/cadastro e o grupo (leitor) — páginas de
// conta de usuário não têm valor de indexação e não devem aparecer em
// busca (login, cadastro, biblioteca pessoal, configurações).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ContaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
