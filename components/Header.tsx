"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContaIcon } from "@/components/ui/ContaIcon";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/artigos", label: "Artigos" },
  { href: "/opiniao", label: "Opinião" },
  { href: "/eventos", label: "Agenda" },
  { href: "/linha-do-tempo", label: "Linha do Tempo" },
  { href: "/museus", label: "Museus" },
  { href: "/acervo", label: "Acervo" },
  { href: "/livro", label: "O Livro" },
];

export function Header({
  nome,
  tagline,
}: {
  nome: string;
  tagline: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          className="flex items-baseline gap-3 font-display text-lg font-bold tracking-tight text-ink transition-[letter-spacing] duration-300 hover:tracking-wide"
        >
          {nome}
          <span className="hidden h-5 w-px bg-borda sm:block" />
          <span className="meta hidden text-chumbo-lt sm:block">
            {tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-underline meta whitespace-nowrap text-[10px] text-chumbo transition-colors hover:text-lacre"
            >
              {link.label}
            </Link>
          ))}
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
            className="meta whitespace-nowrap bg-ink px-4 py-2 text-[10px] tracking-wide text-ouro transition-colors hover:bg-lacre"
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
