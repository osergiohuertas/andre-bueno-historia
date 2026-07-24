// Tipos escritos à mão, no formato que `supabase gen types typescript`
// geraria. Troque por esse comando assim que o projeto existir de verdade
// (ver supabase/README.md) — mas mantenha o schema em sincronia até lá.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Coordenadas = { lat: number; lng: number };

export interface Database {
  public: {
    Tables: {
      eventos: {
        Row: {
          id: string;
          slug: string;
          titulo: string;
          descricao: string;
          data_inicio: string;
          data_fim: string;
          natureza: "cultural" | "academico";
          participacao: "curadoria" | "com_andre";
          local: string;
          cidade: string;
          endereco: string | null;
          coordenadas: Coordenadas | null;
          organizador: string;
          link_inscricao: string | null;
          imagem_capa: string | null;
          publicado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["eventos"]["Row"],
          "id" | "created_at" | "updated_at" | "publicado"
        > & { id?: string; publicado?: boolean };
        Update: Partial<Database["public"]["Tables"]["eventos"]["Insert"]>;
        Relationships: [];
      };
      destinos: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          cidade: string;
          endereco: string;
          coordenadas: Coordenadas;
          horario: string;
          ingresso: string;
          telefone: string | null;
          site: string | null;
          foto: string | null;
          tipologia: string;
          data_verificacao: string;
          texto_autoral: string | null;
          publicado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["destinos"]["Row"],
          "id" | "created_at" | "updated_at" | "publicado"
        > & { id?: string; publicado?: boolean };
        Update: Partial<Database["public"]["Tables"]["destinos"]["Insert"]>;
        Relationships: [];
      };
      publicacoes: {
        Row: {
          id: string;
          slug: string;
          titulo: string;
          tipo: "livro" | "artigo_academico" | "capitulo" | "ensaio";
          veiculo: string;
          ano: number;
          coautores: string | null;
          link: string | null;
          resumo: string | null;
          capa: string | null;
          publicado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["publicacoes"]["Row"],
          "id" | "created_at" | "updated_at" | "publicado"
        > & { id?: string; publicado?: boolean };
        Update: Partial<
          Database["public"]["Tables"]["publicacoes"]["Insert"]
        >;
        Relationships: [];
      };
      acervo_midia: {
        Row: {
          id: string;
          tipo: "video" | "foto";
          titulo: string;
          descricao: string | null;
          categoria: string | null;
          url: string;
          credito: string | null;
          data: string | null;
          publicado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["acervo_midia"]["Row"],
          "id" | "created_at" | "updated_at" | "publicado"
        > & { id?: string; publicado?: boolean };
        Update: Partial<
          Database["public"]["Tables"]["acervo_midia"]["Insert"]
        >;
        Relationships: [];
      };
      destino_artigos: {
        Row: {
          id: string;
          destino_id: string;
          artigo_slug: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["destino_artigos"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["destino_artigos"]["Insert"]
        >;
        Relationships: [];
      };
      site_config: {
        Row: {
          chave: string;
          valor: string;
          tipo:
            | "texto"
            | "texto_longo"
            | "texto_rico"
            | "url"
            | "numero"
            | "booleano"
            | "imagem";
          grupo: string;
          rotulo: string;
          ajuda: string | null;
          max_chars: number | null;
          atualizado: string;
        };
        Insert: Database["public"]["Tables"]["site_config"]["Row"];
        Update: Partial<
          Pick<Database["public"]["Tables"]["site_config"]["Row"], "valor">
        >;
        Relationships: [];
      };
      site_config_history: {
        Row: {
          id: string;
          chave: string;
          valor_anterior: string;
          alterado_em: string;
          alterado_por: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_config_history"]["Row"],
          "id" | "alterado_em"
        > & { id?: string };
        Update: never;
        Relationships: [];
      };
      series: {
        Row: {
          id: string;
          slug: string;
          numero: string;
          nome: string;
          descricao: string | null;
          total_partes: number | null;
          publicado: boolean;
          ordem: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["series"]["Row"],
          "id" | "created_at" | "updated_at" | "publicado"
        > & { id?: string; publicado?: boolean };
        Update: Partial<Database["public"]["Tables"]["series"]["Insert"]>;
        Relationships: [];
      };
      membros: {
        Row: {
          id: string;
          nome: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["membros"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["membros"]["Insert"]>;
        Relationships: [];
      };
      biblioteca_pessoal: {
        Row: {
          id: string;
          membro_id: string;
          artigo_slug: string;
          salvo: boolean;
          lido: boolean;
          salvo_em: string | null;
          lido_em: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["biblioteca_pessoal"]["Row"],
          "id" | "created_at" | "salvo" | "lido" | "salvo_em" | "lido_em"
        > & {
          id?: string;
          salvo?: boolean;
          lido?: boolean;
          salvo_em?: string | null;
          lido_em?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["biblioteca_pessoal"]["Insert"]
        >;
        Relationships: [];
      };
      totem_config: {
        Row: {
          id: string;
          nome_local: string;
          ativo: boolean;
          reset_segundos: number;
          frases: { periodo: string; texto: string; imagem_url: string }[];
          periodos_destaque: string[];
          utm_campaign: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["totem_config"]["Row"],
          "id" | "created_at" | "updated_at" | "ativo" | "reset_segundos" | "frases" | "periodos_destaque"
        > & {
          id?: string;
          ativo?: boolean;
          reset_segundos?: number;
          frases?: { periodo: string; texto: string; imagem_url: string }[];
          periodos_destaque?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["totem_config"]["Insert"]>;
        Relationships: [];
      };
      seguidores_serie: {
        Row: {
          id: string;
          membro_id: string;
          serie_slug: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["seguidores_serie"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["seguidores_serie"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
