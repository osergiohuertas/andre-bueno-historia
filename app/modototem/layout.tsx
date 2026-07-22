import type { Metadata, Viewport } from "next";
import { TotemGuards } from "@/components/totem/TotemGuards";

// Shell próprio do totem: sem Header, sem Footer, sem Lenis — o
// app/(site)/layout.tsx é irmão deste segmento, não ancestral, então nada
// de lá vaza pra cá. Viewport travado porque é touch puro numa tela fixa.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Totem — André Bueno",
  robots: { index: false, follow: false },
};

export default function ModoTotemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 h-dvh w-dvw select-none overflow-hidden bg-ink text-paper"
      style={{ cursor: "none" }}
    >
      <TotemGuards />
      {children}
    </div>
  );
}
