-- Fase 5 — libera as camadas 2 e 3 dos museus (infraestrutura já existia,
-- ver comentário original em museu_artigos).

alter table public.museus
  add column texto_autoral text;

comment on column public.museus.texto_autoral is
  'Camada 2 (Fase 5): texto editorial autoral do André sobre o museu — opcional, além dos dados práticos da camada 1.';

-- Camada 3: vínculo museu <-> artigo agora tem leitura pública.
create policy "Leitura pública de vínculos museu-artigo"
  on public.museu_artigos for select
  to anon, authenticated
  using (true);

-- André precisa gerenciar museus e vínculos pelo /painel/museus (não
-- existia painel nenhum pra isso até a Fase 5).
create policy "André gerencia museus"
  on public.museus for all
  to authenticated
  using (true)
  with check (true);

create policy "André gerencia vínculos museu-artigo"
  on public.museu_artigos for all
  to authenticated
  using (true)
  with check (true);
