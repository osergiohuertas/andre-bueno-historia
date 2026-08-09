export function gerarSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Gera um slug e, se j\u00e1 existir (checado via `existe`), tenta `-2`, `-3`
 * etc at\u00e9 achar um livre. Evita que dois t\u00edtulos parecidos colidam no
 * mesmo slug e um sobrescreva o outro silenciosamente \u2014 ver commitMdx em
 * lib/github.ts, que faz create-OU-update no mesmo caminho sem diferenciar
 * as duas inten\u00e7\u00f5es.
 */
export function slugUnico(base: string, existe: (slug: string) => boolean): string {
  const slugBase = gerarSlug(base);
  if (!existe(slugBase)) return slugBase;

  let contador = 2;
  let candidato = `${slugBase}-${contador}`;
  while (existe(candidato)) {
    contador += 1;
    candidato = `${slugBase}-${contador}`;
  }
  return candidato;
}
