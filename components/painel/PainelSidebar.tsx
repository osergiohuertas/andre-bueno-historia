"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout } from "@/app/painel/actions";
import {
  IconeArtigo,
  IconeOpiniao,
  IconeSeries,
  IconeAcervo,
  IconeAgenda,
  IconeDestino,
  IconeObra,
  IconeTotem,
  IconeSite,
  IconeAnalytics,
} from "@/components/painel/PainelIcons";

type ItemNav = { href: string; label: string; icone: ReactNode };
type GrupoNav = { titulo: string; itens: ItemNav[] };

const GRUPOS: GrupoNav[] = [
  {
    titulo: "Publicar",
    itens: [
      { href: "/painel/artigos", label: "Artigos", icone: <IconeArtigo /> },
      { href: "/painel/novo-artigo", label: "Novo artigo", icone: <IconeArtigo /> },
      { href: "/painel/opinioes", label: "Opiniões", icone: <IconeOpiniao /> },
      { href: "/painel/nova-opiniao", label: "Nova opinião", icone: <IconeOpiniao /> },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { href: "/painel/series", label: "Séries", icone: <IconeSeries /> },
      { href: "/painel/acervo", label: "Acervo", icone: <IconeAcervo /> },
    ],
  },
  {
    titulo: "Agenda & Lugares",
    itens: [
      { href: "/painel/agenda", label: "Agenda", icone: <IconeAgenda /> },
      { href: "/painel/destinos", label: "Destinos", icone: <IconeDestino /> },
    ],
  },
  {
    titulo: "Obra",
    itens: [{ href: "/painel/obra", label: "Obra", icone: <IconeObra /> }],
  },
  {
    titulo: "Experiência",
    itens: [{ href: "/painel/totem", label: "Totem", icone: <IconeTotem /> }],
  },
  {
    titulo: "Site",
    itens: [
      { href: "/painel/conteudo", label: "Configurações", icone: <IconeSite /> },
    ],
  },
];

const ANALYTICS: ItemNav = {
  href: "/painel/analytics",
  label: "Analytics",
  icone: <IconeAnalytics />,
};

function ehAtivo(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ItemLink({ item, ativo, onClick }: { item: ItemNav; ativo: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
        ativo
          ? "bg-ink text-ouro"
          : "text-chumbo hover:bg-paper-mid hover:text-ink"
      }`}
    >
      {item.icone}
      {item.label}
    </Link>
  );
}

function ConteudoSidebar({ pathname, onNavegar }: { pathname: string; onNavegar?: () => void }) {
  return (
    <>
      <Link
        href="/painel/conteudo"
        onClick={onNavegar}
        className="mb-8 block font-display text-lg text-ink"
      >
        Painel
      </Link>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="meta mb-2 px-3 text-chumbo-lt">{grupo.titulo}</p>
            <div className="flex flex-col gap-0.5">
              {grupo.itens.map((item) => (
                <ItemLink
                  key={item.href}
                  item={item}
                  ativo={ehAtivo(pathname, item.href)}
                  onClick={onNavegar}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-0.5 border-t border-borda pt-4">
        <ItemLink
          item={ANALYTICS}
          ativo={ehAtivo(pathname, ANALYTICS.href)}
          onClick={onNavegar}
        />
        <Link
          href="/"
          onClick={onNavegar}
          className="meta px-3 py-2 text-chumbo-lt hover:text-lacre"
        >
          Ver o site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="meta w-full px-3 py-2 text-left text-chumbo-lt hover:text-lacre"
          >
            Sair
          </button>
        </form>
      </div>
    </>
  );
}

export function PainelSidebar() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* Desktop: sidebar fixa */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-borda bg-paper px-4 py-6 md:flex">
        <ConteudoSidebar pathname={pathname} />
      </aside>

      {/* Mobile: barra superior com hambúrguer + drawer */}
      <div className="flex items-center justify-between border-b border-borda bg-paper px-4 py-3 md:hidden">
        <Link href="/painel/conteudo" className="font-display text-lg text-ink">
          Painel
        </Link>
        <button
          type="button"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
          className="flex h-10 w-10 items-center justify-center"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-px w-6 bg-ink transition-transform duration-200 ${
                aberto ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-opacity duration-200 ${
                aberto ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-transform duration-200 ${
                aberto ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {aberto && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-paper px-4 py-6 shadow-xl">
            <ConteudoSidebar pathname={pathname} onNavegar={() => setAberto(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
