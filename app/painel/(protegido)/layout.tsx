import { PainelSidebar } from "@/components/painel/PainelSidebar";

export default function PainelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-paper text-ink md:flex-row">
      <PainelSidebar />
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12">
        {children}
      </main>
    </div>
  );
}
