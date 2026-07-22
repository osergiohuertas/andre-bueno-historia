create table public.site_config (
  chave text primary key,
  valor text not null,
  tipo text not null check (
    tipo in ('texto', 'texto_longo', 'texto_rico', 'url', 'numero', 'booleano', 'imagem')
  ),
  grupo text not null,
  rotulo text not null,
  ajuda text,
  max_chars integer,
  atualizado timestamptz not null default now()
);

comment on table public.site_config is
  'Conteúdo editável pelo André (Fase 1D). O André edita CONTEÚDO, nunca FORMA — cor, fonte e espaçamento continuam fora do alcance da interface. O catálogo de chaves (grupo/tipo/rotulo/max_chars) é gerido por migration/seed, não pelo painel.';

create index site_config_grupo_idx on public.site_config (grupo);

create table public.site_config_history (
  id uuid primary key default gen_random_uuid(),
  chave text not null references public.site_config (chave) on delete cascade,
  valor_anterior text not null,
  alterado_em timestamptz not null default now(),
  alterado_por uuid references auth.users (id)
);

comment on table public.site_config_history is
  'Valor anterior a cada troca de site_config.valor — permite reverter no painel.';

create index site_config_history_chave_idx on public.site_config_history (chave);

create or replace function public.log_site_config_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.valor is distinct from new.valor then
    insert into public.site_config_history (chave, valor_anterior, alterado_por)
    values (old.chave, old.valor, auth.uid());
  end if;
  new.atualizado = now();
  return new;
end;
$$;

create trigger site_config_history_trigger
  before update on public.site_config
  for each row execute function public.log_site_config_history();

alter table public.site_config enable row level security;
alter table public.site_config_history enable row level security;

create policy "Leitura pública de site_config"
  on public.site_config for select
  to anon, authenticated
  using (true);

-- Só UPDATE (o catálogo de chaves não muda pelo painel, só o valor).
create policy "André atualiza valores de site_config"
  on public.site_config for update
  to authenticated
  using (true)
  with check (true);

create policy "André lê o histórico de site_config"
  on public.site_config_history for select
  to authenticated
  using (true);
