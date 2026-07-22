-- Fase 6 — Modo Totem. Configuração editável pelo André via /painel/totem:
-- frases do attract loop, tempo de reset por ociosidade, nome do local (vai
-- no UTM do QR). Uma linha por totem físico — hoje só um, mas o schema já
-- comporta vários locais no futuro.
create table public.totem_config (
  id uuid primary key default gen_random_uuid(),
  nome_local text not null default 'Totem',
  ativo boolean not null default true,
  reset_segundos integer not null default 45,
  frases jsonb not null default '[]'::jsonb,
  periodos_destaque text[] not null default '{}',
  utm_campaign text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.totem_config is
  'Fase 6: configuração do totem físico de quiosque (/modototem). Se vazia, o attract loop cai no fallback dos artigos publicados de maior destaque — ver lib/totem.ts.';

create trigger set_updated_at
  before update on public.totem_config
  for each row execute function public.set_updated_at();

alter table public.totem_config enable row level security;

-- Leitura pública liberada mesmo sem `publicado`: o totem em si é uma
-- tela pública sem autenticação, precisa ler a config direto (anon).
create policy "Leitura pública de totem_config ativa"
  on public.totem_config for select
  to anon, authenticated
  using (ativo = true);

-- André gerencia pelo /painel/totem, logado com a própria conta.
create policy "André gerencia totem_config"
  on public.totem_config for all
  to authenticated
  using (true)
  with check (true);
