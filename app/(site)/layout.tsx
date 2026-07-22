import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { BuscaCmdK } from "@/components/busca/BuscaCmdK";
import { getIdentidadeConfig } from "@/lib/identidade";
import { getRodapeConfig } from "@/lib/rodape";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identidade, rodape] = await Promise.all([
    getIdentidadeConfig(),
    getRodapeConfig(),
  ]);

  return (
    <LenisProvider>
      <div className="flex min-h-full flex-col">
        <Header nome={identidade.nome} tagline={identidade.tagline} />
        <main className="flex-1">{children}</main>
        <Footer nome={identidade.nome} rodape={rodape} />
      </div>
      <BuscaCmdK />
    </LenisProvider>
  );
}
