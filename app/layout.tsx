import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { personSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { getSeoConfig } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// generateMetadata (não `export const metadata` estático) pra poder ler
// title/description do grupo "seo" do site_config — editável em
// Configurações → SEO no painel, com fallback pro texto fixo se estiver
// vazio (ex.: ambiente sem Supabase configurado).
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig();

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.tituloPadrao,
    description: seo.descricaoPadrao,
    // Sem `images`: herda automaticamente do `openGraph.images` de cada
    // página (comportamento padrão do Next) — cobre o site inteiro de graça.
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={personSchema()} />
        <JsonLd data={websiteSchema()} />
        {children}

        {umamiSrc && umamiWebsiteId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
