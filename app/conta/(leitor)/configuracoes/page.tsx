import { ConfiguracoesConta } from "@/components/conta/ConfiguracoesConta";

export default function ConfiguracoesPage() {
  return (
    <div>
      <p className="meta text-lacre">Comunidade</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Configurações</h1>

      <div className="mt-10 max-w-xl">
        <ConfiguracoesConta />
      </div>
    </div>
  );
}
