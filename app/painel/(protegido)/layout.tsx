import { PainelSidebar } from "@/components/painel/PainelSidebar";
import { getSessaoPainel } from "@/lib/painel-auth";

export default async function PainelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessao = await getSessaoPainel();
  const papel = sessao?.papel === "colaborador" ? "colaborador" : "admin";

  return (
    <div className="flex min-h-full flex-col bg-paper text-ink md:flex-row">
      <PainelSidebar papel={papel} />
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12">
        {children}
      </main>
    </div>
  );
}
