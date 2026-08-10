import type { Metadata } from "next";

// Cobre /painel/login e todo o grupo (protegido) numa tacada só — o login é
// "use client" e não pode exportar metadata, e o layout de (protegido) hoje
// não tinha nenhum. Sem isso, o painel administrativo inteiro ficava
// elegível pra indexação, mesmo atrás de auth.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PainelRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
