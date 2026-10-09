// Backup completo do Supabase: todas as tabelas (JSON), lista de usuários
// do Auth (sem senhas) e todos os arquivos do bucket "uploads". Roda no
// GitHub Actions (.github/workflows/backup.yml) — saída em ./backup/.
//
// Uso local: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/backup-supabase.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const URL_BASE = process.env.SUPABASE_URL;
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !CHAVE) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const TABELAS = [
  "site_config",
  "site_config_history",
  "series",
  "eventos",
  "destinos",
  "destino_artigos",
  "publicacoes",
  "acervo_midia",
  "totem_config",
  "membros",
  "biblioteca_pessoal",
  "seguidores_serie",
  "colaboradores",
];
const BUCKET = "uploads";
const SAIDA = "backup";
const headers = { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` };

async function json(caminho, opcoes = {}) {
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    ...opcoes,
    headers: { ...headers, "Content-Type": "application/json", ...opcoes.headers },
  });
  if (!resposta.ok) {
    throw new Error(`${caminho}: ${resposta.status} ${await resposta.text()}`);
  }
  return resposta.json();
}

async function salvar(caminho, conteudo) {
  const destino = join(SAIDA, caminho);
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, conteudo);
}

async function exportarTabelas() {
  const resumo = {};
  for (const tabela of TABELAS) {
    const linhas = [];
    const pagina = 1000;
    for (let inicio = 0; ; inicio += pagina) {
      const lote = await json(`/rest/v1/${tabela}?select=*`, {
        headers: { Range: `${inicio}-${inicio + pagina - 1}` },
      });
      linhas.push(...lote);
      if (lote.length < pagina) break;
    }
    await salvar(`tabelas/${tabela}.json`, JSON.stringify(linhas, null, 2));
    resumo[tabela] = linhas.length;
  }
  return resumo;
}

async function exportarUsuarios() {
  const usuarios = [];
  for (let pagina = 1; ; pagina++) {
    const { users } = await json(`/auth/v1/admin/users?page=${pagina}&per_page=1000`);
    usuarios.push(
      ...users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        user_metadata: u.user_metadata,
      })),
    );
    if (users.length < 1000) break;
  }
  await salvar("auth/usuarios.json", JSON.stringify(usuarios, null, 2));
  return usuarios.length;
}

async function listarArquivos(prefixo = "") {
  const arquivos = [];
  for (let offset = 0; ; offset += 1000) {
    const itens = await json(`/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      body: JSON.stringify({ prefix: prefixo, limit: 1000, offset }),
    });
    for (const item of itens) {
      const caminho = prefixo ? `${prefixo}/${item.name}` : item.name;
      // Pastas vêm sem id no Storage — desce nelas recursivamente.
      if (item.id === null) arquivos.push(...(await listarArquivos(caminho)));
      else arquivos.push(caminho);
    }
    if (itens.length < 1000) break;
  }
  return arquivos;
}

async function exportarArquivos() {
  const arquivos = await listarArquivos();
  for (const caminho of arquivos) {
    const resposta = await fetch(
      `${URL_BASE}/storage/v1/object/${BUCKET}/${caminho}`,
      { headers },
    );
    if (!resposta.ok) {
      console.warn(`Falhou: ${caminho} (${resposta.status})`);
      continue;
    }
    await salvar(`storage/${BUCKET}/${caminho}`, Buffer.from(await resposta.arrayBuffer()));
  }
  return arquivos.length;
}

const tabelas = await exportarTabelas();
const usuarios = await exportarUsuarios();
const arquivos = await exportarArquivos();
const manifesto = { geradoEm: new Date().toISOString(), tabelas, usuarios, arquivos };
await salvar("manifesto.json", JSON.stringify(manifesto, null, 2));
console.log(JSON.stringify(manifesto, null, 2));
