"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContaIcon } from "@/components/ui/ContaIcon";

const NAV_PRINCIPAL = [
  { href: "/artigos", label: "Artigos" },
  { href: "/acervo", label: "Acervo" },
  { href: "/destinos", label: "Destinos" },
  { href: "/eventos", label: "Agenda" },
  { href: "/sobre", label: "Sobre" },
];

const NAV_MAIS = [
  { href: "/opiniao", label: "Opinião" },
  { href: "/linha-do-tempo", label: "Linha do Tempo" },
];

const NAV_LIVRO = { href: "/livro", label: "O Livro" };

const NAV_LINKS = [...NAV_PRINCIPAL, ...NAV_MAIS, NAV_LIVRO];

function ehAtivo(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({
  nome,
  tagline,
}: {
  nome: string;
  tagline: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [maisAberto, setMaisAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const maisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!maisAberto) return;
    const fechar = (e: MouseEvent) => {
      if (!maisRef.current?.contains(e.target as Node)) setMaisAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMaisAberto(false);
    document.addEventListener("mousedown", fechar);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fechar);
      document.removeEventListener("keydown", esc);
    };
  }, [maisAberto]);

  const linkClasse = (href: string) =>
    `nav-underline meta whitespace-nowrap text-[10px] transition-colors hover:text-lacre ${
      ehAtivo(pathname, href) ? "text-lacre" : "text-chumbo"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-borda bg-paper transition-shadow duration-300 ${
        scrolled ? "shadow-[0_12px_24px_-16px_rgba(13,13,13,0.18)]" : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-between px-6 transition-[height] duration-300 md:px-16 lg:px-20 ${
          scrolled ? "h-14" : "h-16 md:h-20"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-baseline gap-3 whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink transition-[letter-spacing] duration-300 hover:tracking-wide"
        >
          {nome}
          <span className="hidden h-5 w-px bg-borda sm:block lg:hidden xl:block" />
          <span className="meta hidden text-chumbo-lt sm:block lg:hidden xl:block">
            {tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {NAV_PRINCIPAL.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={ehAtivo(pathname, link.href) ? "page" : undefined}
              className={linkClasse(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <div ref={maisRef} className="relative">
            <button
              type="button"
              aria-expanded={maisAberto}
              aria-haspopup="true"
              onClick={() => setMaisAberto((v) => !v)}
              className={`meta flex items-center gap-1 whitespace-nowrap text-[10px] transition-colors hover:text-lacre ${
                NAV_MAIS.some((l) => ehAtivo(pathname, l.href))
                  ? "text-lacre"
                  : "text-chumbo"
              }`}
            >
              Mais
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className={`transition-transform ${maisAberto ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {maisAberto && (
              <div className="absolute right-0 top-full mt-4 min-w-[180px] border border-borda bg-paper py-2 shadow-[0_18px_40px_-20px_rgba(13,13,13,0.35)]">
                {NAV_MAIS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMaisAberto(false)}
                    className={`meta block px-5 py-2.5 text-[10px] transition-colors hover:bg-paper-mid hover:text-lacre ${
                      ehAtivo(pathname, link.href) ? "text-lacre" : "text-chumbo"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <span className="h-5 w-px bg-borda" aria-hidden />
          <Link
            href={NAV_LIVRO.href}
            aria-current={ehAtivo(pathname, NAV_LIVRO.href) ? "page" : undefined}
            className="meta whitespace-nowrap border border-ink px-3.5 py-2 text-[10px] text-ink transition-colors hover:border-lacre hover:bg-lacre hover:text-paper"
          >
            {NAV_LIVRO.label}
          </Link>
          <button
            type="button"
            aria-label="Buscar (⌘K)"
            onClick={() => window.dispatchEvent(new Event("abrir-busca"))}
            className="flex h-8 w-8 items-center justify-center text-chumbo transition-colors hover:text-lacre"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <ContaIcon className="h-8 w-8" />
          <Link
            href="/conta/entrar"
            className="meta hidden whitespace-nowrap bg-ink xl:inline-block px-4 py-2 text-[10px] tracking-wide text-ouro transition-colors hover:bg-lacre"
          >
            Assinar carta
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => window.dispatchEvent(new Event("abrir-busca"))}
            className="flex h-10 w-10 items-center justify-center text-chumbo"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-px w-6 bg-ink transition-transform duration-200 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-transform duration-200 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        className={`overflow-y-auto border-borda bg-paper transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[calc(100vh-4rem)] border-t" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4 md:px-16 lg:px-20">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="meta py-3 text-chumbo hover:text-lacre"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-3">
            <ContaIcon className="h-11 w-11" onClick={() => setOpen(false)} />
            <Link
              href="/conta/entrar"
              onClick={() => setOpen(false)}
              className="meta flex-1 bg-ink py-3 text-center tracking-wide text-ouro transition-colors hover:bg-lacre"
            >
              Assinar carta
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
