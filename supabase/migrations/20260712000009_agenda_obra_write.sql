-- FOR ALL cobre select/insert/update/delete para o André autenticado,
-- inclusive registros ainda não publicados (ele precisa vê-los no painel).
-- Mesmo padrão de supabase/migrations/20260712000008_series.sql.

create policy "André gerencia eventos"
  on public.eventos for all
  to authenticated
  using (true)
  with check (true);

create policy "André gerencia publicações"
  on public.publicacoes for all
  to authenticated
  using (true)
  with check (true);

create policy "André gerencia mídia"
  on public.acervo_midia for all
  to authenticated
  using (true)
  with check (true);
