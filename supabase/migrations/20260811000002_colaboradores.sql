-- Nível de usuário "colaborador": outros historiadores podem logar no
-- painel e publicar os próprios artigos, sem o acesso total que hoje
-- qualquer conta autenticada (não-leitora) tem. Ver
-- lib/supabase/middleware.ts (ehLeitor já usa esse mesmo padrão — linha
-- em tabela == papel) e lib/painel-auth.ts.

create table public.colaboradores (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

comment on table public.colaboradores is
  'Contas de painel restritas a publicar/editar os próprios artigos — sem policy pra authenticated/anon de propósito, só o client admin (service_role) lê/escreve aqui.';

alter table public.colaboradores enable row level security;

-- Middleware e lib/painel-auth.ts leem isto com o client da sessão do
-- próprio usuário (não o admin) pra decidir o papel de quem logou — sem
-- essa policy, RLS bloquearia até o colaborador ler a própria linha.
create policy "Colaborador lê a própria linha" on public.colaboradores
  for select to authenticated
  using (auth.uid() = id);

create or replace function public.is_colaborador(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.colaboradores where id = uid and ativo
  );
$$;

-- Endurece as tabelas hoje com "escrita liberada pra qualquer
-- authenticated" (documentado em supabase/README.md) — colaborador
-- passa a ser bloqueado de escrever nelas, admin (André) continua igual.

drop policy "André gerencia eventos" on public.eventos;
create policy "André gerencia eventos" on public.eventos
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André gerencia publicações" on public.publicacoes;
create policy "André gerencia publicações" on public.publicacoes
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André gerencia mídia" on public.acervo_midia;
create policy "André gerencia mídia" on public.acervo_midia
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André gerencia museus" on public.destinos;
create policy "André gerencia museus" on public.destinos
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André gerencia vínculos museu-artigo" on public.destino_artigos;
create policy "André gerencia vínculos museu-artigo" on public.destino_artigos
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André gerencia totem_config" on public.totem_config;
create policy "André gerencia totem_config" on public.totem_config
  for all to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André atualiza valores de site_config" on public.site_config;
create policy "André atualiza valores de site_config" on public.site_config
  for update to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));

drop policy "André lê o histórico de site_config" on public.site_config_history;
create policy "André lê o histórico de site_config" on public.site_config_history
  for select to authenticated
  using (not public.is_colaborador(auth.uid()));

-- `series` é diferente das outras: colaborador precisa continuar
-- LENDO (dropdown de série no wizard de novo artigo), só não pode
-- escrever. Troca a policy única "for all" por duas.
drop policy "André gerencia séries" on public.series;
create policy "Leitura de séries para o painel" on public.series
  for select to authenticated
  using (true);
create policy "André escreve séries" on public.series
  for insert to authenticated
  with check (not public.is_colaborador(auth.uid()));
create policy "André atualiza séries" on public.series
  for update to authenticated
  using (not public.is_colaborador(auth.uid()))
  with check (not public.is_colaborador(auth.uid()));
create policy "André apaga séries" on public.series
  for delete to authenticated
  using (not public.is_colaborador(auth.uid()));
