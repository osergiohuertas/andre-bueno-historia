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
