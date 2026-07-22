
-- ==== 20260712000001_helpers.sql ====
-- Função compartilhada: atualiza updated_at em qualquer UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ==== 20260712000002_eventos.sql ====
create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  descricao text not null,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  natureza text not null check (natureza in ('cultural', 'academico')),
  participacao text not null check (participacao in ('curadoria', 'com_andre')),
  local text not null,
  cidade text not null,
  endereco text,
  coordenadas jsonb,
  organizador text not null,
  link_inscricao text,
  imagem_capa text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.eventos is
  'Eventos da agenda (Fase 3). Cruzamento de dois eixos independentes: natureza (cultural|academico) e participacao (curadoria|com_andre). Transição futuro->arquivo é derivada de data_fim, sem edição manual.';

create index eventos_data_fim_idx on public.eventos (data_fim);
create index eventos_natureza_idx on public.eventos (natureza);
create index eventos_participacao_idx on public.eventos (participacao);

create trigger set_updated_at
  before update on public.eventos
  for each row execute function public.set_updated_at();

alter table public.eventos enable row level security;

create policy "Leitura pública de eventos publicados"
  on public.eventos for select
  to anon, authenticated
  using (publicado = true);


-- ==== 20260712000003_museus.sql ====
create table public.museus (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  cidade text not null,
  endereco text not null,
  coordenadas jsonb not null,
  horario text not null,
  ingresso text not null,
  telefone text,
  site text,
  foto text,
  tipologia text not null,
  data_verificacao date not null,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.museus is
  'Catálogo de museus (Fase 4). Camada 1 apenas: dados práticos. O site oficial do museu é a fonte definitiva — data_verificacao precisa ser exibida sempre.';

create index museus_cidade_idx on public.museus (cidade);
create index museus_tipologia_idx on public.museus (tipologia);

create trigger set_updated_at
  before update on public.museus
  for each row execute function public.set_updated_at();

alter table public.museus enable row level security;

create policy "Leitura pública de museus publicados"
  on public.museus for select
  to anon, authenticated
  using (publicado = true);


-- ==== 20260712000004_publicacoes.sql ====
create table public.publicacoes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  tipo text not null check (tipo in ('livro', 'artigo_academico', 'capitulo', 'ensaio')),
  veiculo text not null,
  ano integer not null,
  coautores text,
  link text,
  resumo text,
  capa text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.publicacoes is
  'Obra do autor (Fase 3). /obra/livros e /obra/publicacoes são a mesma tabela filtrada por tipo — tipo=livro para o primeiro, os demais para o segundo. Não confundir com /livro, que é a vitrine de conversão (dados em site_config, Fase 1D).';

create index publicacoes_tipo_idx on public.publicacoes (tipo);
create index publicacoes_ano_idx on public.publicacoes (ano);

create trigger set_updated_at
  before update on public.publicacoes
  for each row execute function public.set_updated_at();

alter table public.publicacoes enable row level security;

create policy "Leitura pública de publicações publicadas"
  on public.publicacoes for select
  to anon, authenticated
  using (publicado = true);


-- ==== 20260712000005_acervo_midia.sql ====
create table public.acervo_midia (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('video', 'foto')),
  titulo text not null,
  descricao text,
  categoria text,
  url text not null,
  credito text,
  data date,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.acervo_midia is
  'Vídeos e fotos da obra do autor (Fase 3, /obra/videos e /obra/fotos). Vídeo: url é sempre embed (YouTube/Vimeo), nunca upload. categoria para vídeo: entrevista|congresso|simposio|seminario. credito obrigatório (em app) para foto de terceiro.';

create index acervo_midia_tipo_idx on public.acervo_midia (tipo);
create index acervo_midia_categoria_idx on public.acervo_midia (categoria);

create trigger set_updated_at
  before update on public.acervo_midia
  for each row execute function public.set_updated_at();

alter table public.acervo_midia enable row level security;

create policy "Leitura pública de mídia publicada"
  on public.acervo_midia for select
  to anon, authenticated
  using (publicado = true);


-- ==== 20260712000006_museu_artigos.sql ====
create table public.museu_artigos (
  id uuid primary key default gen_random_uuid(),
  museu_id uuid not null references public.museus (id) on delete cascade,
  -- Artigos vivem em MDX/Git, não no Supabase — o vínculo é pelo slug.
  artigo_slug text not null,
  created_at timestamptz not null default now(),
  unique (museu_id, artigo_slug)
);

comment on table public.museu_artigos is
  'Vínculo museu <-> artigo (Fase 4/Atlas, camada 3 do museu — só libera na Fase 5). Infraestrutura criada agora, sem página pública ainda: RLS ligado, sem policy de leitura pública.';

create index museu_artigos_museu_id_idx on public.museu_artigos (museu_id);
create index museu_artigos_artigo_slug_idx on public.museu_artigos (artigo_slug);

alter table public.museu_artigos enable row level security;

-- Nenhuma policy de SELECT pública ainda: só service role acessa,
-- até a camada 3 dos museus ser liberada na Fase 5.


-- ==== 20260712000007_site_config.sql ====
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


-- ==== 20260712000008_series.sql ====
create table public.series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  numero text not null,
  nome text not null,
  descricao text,
  total_partes integer,
  publicado boolean not null default false,
  ordem integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.series is
  'Séries editoriais (Fase 1D). Migrado para o Supabase porque o André cria série nova sem poder depender de commit. O artigo continua em MDX e referencia a série pelo campo `serie` = slug desta tabela.';

create index series_publicado_idx on public.series (publicado);
create index series_ordem_idx on public.series (ordem);

create trigger set_updated_at
  before update on public.series
  for each row execute function public.set_updated_at();

alter table public.series enable row level security;

create policy "Leitura pública de séries publicadas"
  on public.series for select
  to anon
  using (publicado = true);

-- FOR ALL cobre select/insert/update/delete para o André autenticado,
-- inclusive séries ainda não publicadas (ele precisa vê-las no painel).
create policy "André gerencia séries"
  on public.series for all
  to authenticated
  using (true)
  with check (true);


-- ==== 20260712000009_agenda_obra_write.sql ====
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


-- ==== 20260713000001_membros.sql ====
-- Fase 5 — Comunidade. Leitor público, distinto do André: todo leitor tem
-- uma linha aqui; o André (conta única de operador, criada fora deste
-- fluxo) nunca tem. É essa ausência/presença que o proxy usa pra separar
-- /painel (só André) de /conta (só leitor) — ver lib/supabase/middleware.ts.
create table public.membros (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.membros is
  'Perfil público de leitor (Fase 5). 1:1 com auth.users — on delete cascade apaga o perfil quando a conta é excluída. André nunca tem linha aqui.';

create trigger set_updated_at
  before update on public.membros
  for each row execute function public.set_updated_at();

alter table public.membros enable row level security;

create policy "Leitor vê e edita o próprio perfil"
  on public.membros for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Biblioteca pessoal: salvar artigo e marcar como lido. Artigo é MDX/Git,
-- não tem FK — referenciado pelo slug.
create table public.biblioteca_pessoal (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null references public.membros (id) on delete cascade,
  artigo_slug text not null,
  salvo boolean not null default false,
  lido boolean not null default false,
  salvo_em timestamptz,
  lido_em timestamptz,
  created_at timestamptz not null default now(),
  unique (membro_id, artigo_slug)
);

comment on table public.biblioteca_pessoal is
  'Biblioteca pessoal do leitor (Fase 5): estado salvo/lido por artigo. artigo_slug referencia o MDX em content/artigos, sem FK.';

create index biblioteca_pessoal_membro_id_idx on public.biblioteca_pessoal (membro_id);

alter table public.biblioteca_pessoal enable row level security;

create policy "Leitor gerencia a própria biblioteca"
  on public.biblioteca_pessoal for all
  to authenticated
  using (membro_id = auth.uid())
  with check (membro_id = auth.uid());

-- Séries seguidas: notificação por e-mail quando sai parte nova
-- (publicarArtigoAction, Fase 2, dispara pra quem segue a série do artigo).
create table public.seguidores_serie (
  id uuid primary key default gen_random_uuid(),
  membro_id uuid not null references public.membros (id) on delete cascade,
  serie_slug text not null,
  created_at timestamptz not null default now(),
  unique (membro_id, serie_slug)
);

comment on table public.seguidores_serie is
  'Quem segue qual série (Fase 5). serie_slug = slug da tabela series. Publicar artigo novo da série dispara e-mail pros seguidores.';

create index seguidores_serie_serie_slug_idx on public.seguidores_serie (serie_slug);

alter table public.seguidores_serie enable row level security;

create policy "Leitor gerencia as próprias séries seguidas"
  on public.seguidores_serie for all
  to authenticated
  using (membro_id = auth.uid())
  with check (membro_id = auth.uid());


-- ==== 20260713000002_museus_camada_2_3.sql ====
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


-- ==== seed.sql ====
-- Popula site_config com todos os campos da Fase 1D e a primeira série.
-- Rode depois das migrations. Os valores de "home"/"identidade" são o
-- conteúdo real atual do site; "sobre"/"livro"/"rodape"/"seo" ainda são
-- placeholder — troque pelo painel quando tiver o conteúdo definitivo.

insert into public.site_config (chave, valor, tipo, grupo, rotulo, ajuda, max_chars) values
  -- identidade
  ('identidade.nome', 'André Bueno', 'texto', 'identidade', 'Nome', 'Nome do autor, usado no cabeçalho e no rodapé.', 60),
  ('identidade.tagline', 'História', 'texto', 'identidade', 'Tagline', 'Frase curta que descreve o site.', 40),

  -- home
  ('home.hero.eyebrow', 'Historiador · Pesquisador', 'texto', 'home', 'Selo acima do título (home)', 'Aparece como primeira linha do site, acima do título principal.', 60),
  ('home.hero.titulo', 'História do Brasil, contada com <em>rigor</em> e fontes reais.', 'texto_rico', 'home', 'Título principal (home)', 'O título grande da home. Só a palavra em <em> aparece destacada na cor de destaque.', 90),
  ('home.hero.descricao', 'Artigos, acervo documental e ferramentas de pesquisa sobre a história do Brasil — da colônia à ditadura, sempre com fonte declarada.', 'texto_longo', 'home', 'Descrição (home)', 'Parágrafo abaixo do título principal da home.', 280),
  ('home.hero.cta_primario', 'Ler os artigos', 'texto', 'home', 'Botão principal (home)', 'Texto do primeiro botão da home, leva para /artigos.', 30),
  ('home.hero.cta_secundario', 'Explorar a linha do tempo', 'texto', 'home', 'Botão secundário (home)', 'Texto do segundo botão da home, leva para /linha-do-tempo.', 30),
  ('home.stats.1.label', 'Artigos publicados', 'texto', 'home', 'Rótulo do 1º número (home)', 'O número em si é sempre calculado — você só edita o texto abaixo dele.', 30),
  ('home.stats.2.label', 'Períodos documentados', 'texto', 'home', 'Rótulo do 2º número (home)', 'O número em si é sempre calculado — você só edita o texto abaixo dele.', 30),
  ('home.stats.3.label', 'Anos de história', 'texto', 'home', 'Rótulo do 3º número (home)', 'O número em si é sempre calculado — você só edita o texto abaixo dele.', 30),
  ('home.newsletter.titulo', 'Um artigo novo, direto no seu e-mail.', 'texto_rico', 'home', 'Título da newsletter (home)', 'Título do bloco de newsletter, no fim da home.', 80),
  ('home.newsletter.corpo', 'Sem spam, sem venda de dados. Você pode cancelar quando quiser.', 'texto_longo', 'home', 'Texto da newsletter (home)', 'Linha de apoio abaixo do título da newsletter.', 400),

  -- sobre
  ('sobre.manifesto', '[Manifesto — por que este site existe, em poucos parágrafos.]', 'texto_longo', 'sobre', 'Manifesto', 'Texto de abertura da página /sobre. Aceita markdown básico.', 1200),
  ('sobre.trajetoria', '[Trajetória acadêmica e profissional do André.]', 'texto_longo', 'sobre', 'Trajetória', 'Segundo bloco da página /sobre.', 2000),
  ('sobre.metodologia', '[Como o André pesquisa e escreve — o método por trás do site.]', 'texto_longo', 'sobre', 'Metodologia', 'Terceiro bloco da página /sobre.', 2000),
  ('sobre.foto_url', '', 'imagem', 'sobre', 'Foto do autor', 'Foto usada na página /sobre.', null),
  ('sobre.email_contato', '', 'url', 'sobre', 'E-mail de contato', 'E-mail público exibido em /sobre.', null),

  -- livro (placeholder — ver data/livro.defaults.ts)
  ('livro.titulo', '[Título do livro]', 'texto', 'livro', 'Título do livro', 'Aparece na capa e no título de /livro.', 120),
  ('livro.subtitulo', '[Subtítulo — uma frase que resume a proposta do livro]', 'texto', 'livro', 'Subtítulo do livro', 'Linha abaixo do título em /livro.', 160),
  ('livro.argumento', '[Argumento central do livro em uma ou duas frases fortes.]', 'texto_longo', 'livro', 'Argumento', 'Frase de efeito sobre o livro.', 400),
  ('livro.sobre', '[Texto de apresentação do livro — alguns parágrafos.]', 'texto_longo', 'livro', 'Sobre o livro', 'Texto editorial da seção "Sobre o livro" em /livro.', 3500),
  ('livro.capa_url', '', 'imagem', 'livro', 'Capa do livro', 'Imagem usada na capa 3D de /livro.', null),
  ('livro.amazon.url_fisico', 'https://www.amazon.com.br/dp/PLACEHOLDER', 'url', 'livro', 'Link Amazon (físico)', 'Para onde o botão "Comprar" leva.', null),
  ('livro.amazon.url_kindle', 'https://www.amazon.com.br/dp/PLACEHOLDER-KINDLE', 'url', 'livro', 'Link Amazon (Kindle)', 'Versão digital, se houver.', null),
  ('livro.amazon.tag_afiliado', '', 'texto', 'livro', 'Tag de afiliado Amazon', 'Adicionada automaticamente ao link da Amazon.', 40),
  ('livro.amostra_pdf_url', '', 'url', 'livro', 'Amostra em PDF', 'Link para um capítulo de amostra, se houver.', null),
  ('livro.revelacao.1.titulo', '[Revelação 1]', 'texto', 'livro', 'Revelação 1 — título', 'Primeiro card da grade "Revelações" em /livro.', 80),
  ('livro.revelacao.1.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 1 — texto', '', 300),
  ('livro.revelacao.2.titulo', '[Revelação 2]', 'texto', 'livro', 'Revelação 2 — título', '', 80),
  ('livro.revelacao.2.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 2 — texto', '', 300),
  ('livro.revelacao.3.titulo', '[Revelação 3]', 'texto', 'livro', 'Revelação 3 — título', '', 80),
  ('livro.revelacao.3.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 3 — texto', '', 300),
  ('livro.revelacao.4.titulo', '[Revelação 4]', 'texto', 'livro', 'Revelação 4 — título', '', 80),
  ('livro.revelacao.4.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 4 — texto', '', 300),
  ('livro.revelacao.5.titulo', '[Revelação 5]', 'texto', 'livro', 'Revelação 5 — título', '', 80),
  ('livro.revelacao.5.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 5 — texto', '', 300),
  ('livro.revelacao.6.titulo', '[Revelação 6]', 'texto', 'livro', 'Revelação 6 — título', '', 80),
  ('livro.revelacao.6.texto', '[O que o leitor descobre]', 'texto_longo', 'livro', 'Revelação 6 — texto', '', 300),

  -- rodape
  ('rodape.descricao', 'Pesquisa, escrita e acervo sobre a história do Brasil — da colônia à ditadura.', 'texto_longo', 'rodape', 'Descrição do rodapé', 'Texto abaixo do nome, no rodapé de todas as páginas.', 300),
  ('rodape.social.twitter', '', 'url', 'rodape', 'Twitter/X', '', null),
  ('rodape.social.instagram', '', 'url', 'rodape', 'Instagram', '', null),
  ('rodape.social.youtube', '', 'url', 'rodape', 'YouTube', '', null),
  ('rodape.social.linkedin', '', 'url', 'rodape', 'LinkedIn', '', null),

  -- seo
  ('seo.titulo_padrao', 'André Bueno — História', 'texto', 'seo', 'Título padrão (SEO)', 'Usado quando uma página não define um título próprio.', 70),
  ('seo.descricao_padrao', 'Plataforma editorial do historiador André Bueno: artigos, acervo documental e ferramentas de pesquisa sobre a história do Brasil.', 'texto', 'seo', 'Descrição padrão (SEO)', 'Usado quando uma página não define uma descrição própria.', 160),
  ('seo.og_imagem', '', 'imagem', 'seo', 'Imagem padrão (Open Graph)', 'Usada ao compartilhar o site em redes sociais.', null)
on conflict (chave) do nothing;

insert into public.series (slug, numero, nome, descricao, total_partes, publicado, ordem) values
  ('minas-colonial', 'I', 'Minas Colonial', 'A vida, o ouro e as revoltas em Minas Gerais durante o período colonial.', 1, true, 1)
on conflict (slug) do nothing;

-- ==== 20260716000001_totem_config.sql ====
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

create policy "Leitura pública de totem_config ativa"
  on public.totem_config for select
  to anon, authenticated
  using (ativo = true);

create policy "André gerencia totem_config"
  on public.totem_config for all
  to authenticated
  using (true)
  with check (true);
