// Valores de fallback de /livro. Os dados reais vivem no Supabase
// (site_config, grupo "livro") a partir da Fase 1D — o André edita pelo
// painel, sem commit. Isto aqui só cobre o banco não responder.
//
// Conteúdo puxado da ficha real do livro na Amazon (ver amazonUrlFisico)
// em 2026-07-13. amazonUrlKindle segue placeholder — a ficha só lista
// edição em capa comum, sem versão Kindle até o momento.

export type Revelacao = {
  titulo: string;
  descricao: string;
};

export const LIVRO_DEFAULTS = {
  titulo: "Colônia Santa Isabel",
  subtitulo: "Memória, patrimônio cultural e ressignificação",
  argumento:
    "Mais do que descrever espaços e lugares, esta obra revela os significados simbólicos e afetivos presentes em Santa Isabel — um território que concentra memórias de dor, resistência, criação e reinvenção.",
  sobre:
    "Inaugurada em 1931, a Colônia Santa Isabel foi criada como espaço de isolamento compulsório para pessoas acometidas pela hanseníase, sob a lógica sanitarista que as excluía do convívio social. Durante cinco décadas, o território foi marcado pelo confinamento, pelo controle estatal e pelo estigma. Contudo, para além da exclusão, consolidaram-se formas de resistência, sociabilidade e produção cultural que transformaram o espaço imposto em lugar de identidade, memória e pertencimento. Esta obra apresenta uma pesquisa pioneira dedicada à identificação, ao mapeamento e à historicização dos espaços e lugares de memória que compõem o conjunto urbano da Colônia Santa Isabel. Desenvolvida no âmbito do Mestrado Profissional da UFMG, a investigação articula memória, memória traumática, patrimônio cultural e história cultural do urbano, oferecendo uma leitura inédita das camadas temporais inscritas no território. Este trabalho é atravessado por uma perspectiva muito particular: o autor é morador e filho desta comunidade, e também pesquisador da Colônia Santa Isabel — dupla condição, de pertencimento e investigação, que orienta cada página desta obra.",
  capaUrl: "https://m.media-amazon.com/images/I/617FYuLcVwL._SL1000_.jpg" as
    | string
    | undefined,
  amazonUrlFisico:
    "https://www.amazon.com.br/COLÔNIA-SANTA-ISABEL-patrimônio-ressignificação/dp/6552035993",
  amazonUrlKindle: "https://www.amazon.com.br/dp/PLACEHOLDER-KINDLE",
  amazonTagAfiliado: "",
  amostraPdfUrl: undefined as string | undefined,
  revelacoes: [
    {
      titulo: "Isolamento compulsório",
      descricao:
        "Criada em 1931 para confinar compulsoriamente pessoas com hanseníase, sob a lógica sanitarista que as excluía do convívio social.",
    },
    {
      titulo: "Resistência e sociabilidade",
      descricao:
        "Para além da exclusão, floresceram formas de resistência, sociabilidade e produção cultural que transformaram o espaço imposto em lugar de identidade.",
    },
    {
      titulo: "Pesquisa pioneira",
      descricao:
        "Primeiro mapeamento e historicização dos espaços e lugares de memória que compõem o conjunto urbano da Colônia Santa Isabel.",
    },
    {
      titulo: "Mestrado Profissional na UFMG",
      descricao:
        "A investigação articula memória, memória traumática, patrimônio cultural e história cultural do urbano.",
    },
    {
      titulo: "Um olhar de dentro",
      descricao:
        "Escrito por quem é morador e filho da comunidade — e também seu pesquisador, unindo pertencimento e investigação.",
    },
    {
      titulo: "Contribuição inédita",
      descricao:
        "Uma contribuição original aos estudos sobre antigas colônias de hanseníase no Brasil, reafirmando Santa Isabel como território de memória viva.",
    },
  ] satisfies Revelacao[],
} as const;
