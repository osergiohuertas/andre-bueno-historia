# Migrations — Supabase

Schemas de `eventos`, `museus`, `publicacoes`, `acervo_midia`, `museu_artigos`
(Fase 1C), `site_config` + `series` (Fase 1D), policies de escrita da
agenda/obra (Fase 3), camadas 2/3 dos museus (Fase 4/5), e `membros` +
`biblioteca_pessoal` + `seguidores_serie` (Fase 5).

## Como aplicar

**Com Supabase CLI** (recomendado, se o projeto já tiver `supabase init`):

```
supabase link --project-ref <seu-project-ref>
supabase db push
```

**Sem CLI:** cole o conteúdo de cada arquivo em `migrations/`, em ordem, no
SQL Editor do painel do Supabase (Database → SQL Editor).

## Depois de aplicar

1. Copie `.env.local.example` para `.env.local` e preencha com as chaves do
   projeto (Project Settings → API).
2. Gere os tipos TypeScript:
   ```
   supabase gen types typescript --project-id <seu-project-ref> > types/supabase.ts
   ```
   Até lá, `types/supabase.ts` tem os tipos escritos à mão, no mesmo formato
   que o CLI geraria — troque pelo gerado assim que o projeto existir.

## RLS

Todas as tabelas de catálogo (`eventos`, `museus`, `publicacoes`,
`acervo_midia`, `museu_artigos`, `site_config`, `series`) têm leitura
pública (`anon`, `authenticated`) onde `publicado = true`, e escrita
liberada pra qualquer usuário **autenticado** — não só `service_role`.
Isso porque o André edita tudo isso pelo painel, logado com a própria
conta. `museu_artigos` também tem leitura pública desde a Fase 5 (camada 3
dos museus).

As tabelas de leitor (`membros`, `biblioteca_pessoal`, `seguidores_serie`,
Fase 5) são o oposto: cada linha só é visível/editável por quem é dono
dela (`auth.uid() = membro_id` ou `= id`). Consultas que cruzam membros
diferentes — notificar quem segue uma série, contar leituras por período
em `/painel/analytics` — passam pelo client admin (`service_role`), que
ignora RLS por design.

## Duas contas, dois logins

**André (operador, uma conta só)** — sem cadastro público. Crie
manualmente:

1. No painel do Supabase: Authentication → Users → Add user.
2. E-mail e senha do André. Marque "Auto Confirm User".
3. Ele loga em `/painel/login` com essas credenciais.

**Leitores (cadastro público, Fase 5)** — em `/conta/cadastro`, com
confirmação de e-mail obrigatória (double opt-in): a conta só vira membro
de verdade — ganha uma linha em `membros` — depois de clicar no link que
o Supabase manda (ver `app/auth/callback/route.ts`). É essa linha em
`membros` que distingue um leitor do André no meio: André nunca tem uma.
Configure em Authentication → Settings → "Confirm email" (deve estar
ligado) e o "Site URL"/"Redirect URLs" apontando pra
`NEXT_PUBLIC_SITE_URL` + `/auth/callback`.

## Seed do site_config

Depois de aplicar as migrations, rode o seed com todos os campos da Fase 1D
já populados com o conteúdo atual do site — ver `supabase/seed.sql`.
