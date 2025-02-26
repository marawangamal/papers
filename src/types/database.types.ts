export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      collection_papers: {
        Row: {
          collection_id: string
          created_at: string | null
          paper_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          paper_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          paper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_papers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_papers_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "vw_final_collection_papers"
            referencedColumns: ["collection_id"]
          },
          {
            foreignKeyName: "collection_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "vw_final_collection_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "vw_final_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "vw_final_papers_personal"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_final_papers_personal"
            referencedColumns: ["user_id"]
          },
        ]
      }
      papers: {
        Row: {
          abstract: string | null
          abstract_embedding: string | null
          authors: string[] | null
          code_url: string | null
          created_at: string | null
          id: string
          normalized_title: string | null
          pdf_url: string | null
          status: string | null
          title: string
          venue_id: string | null
        }
        Insert: {
          abstract?: string | null
          abstract_embedding?: string | null
          authors?: string[] | null
          code_url?: string | null
          created_at?: string | null
          id?: string
          normalized_title?: string | null
          pdf_url?: string | null
          status?: string | null
          title: string
          venue_id?: string | null
        }
        Update: {
          abstract?: string | null
          abstract_embedding?: string | null
          authors?: string[] | null
          code_url?: string | null
          created_at?: string | null
          id?: string
          normalized_title?: string | null
          pdf_url?: string | null
          status?: string | null
          title?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "papers_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          created_at: string | null
          id: number
          search_query: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          search_query: string
        }
        Update: {
          created_at?: string | null
          id?: never
          search_query?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          abbrev: string | null
          created_at: string | null
          id: string
          name: string
          year: number
        }
        Insert: {
          abbrev?: string | null
          created_at?: string | null
          id?: string
          name: string
          year: number
        }
        Update: {
          abbrev?: string | null
          created_at?: string | null
          id?: string
          name?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_final_collection_papers: {
        Row: {
          abstract: string | null
          abstract_embedding: string | null
          authors: string[] | null
          code_url: string | null
          collection_id: string | null
          collection_name: string | null
          created_at: string | null
          id: string | null
          normalized_title: string | null
          pdf_url: string | null
          status: string | null
          title: string | null
          user_id: string | null
          venue_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_final_papers_personal"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "papers_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_final_papers: {
        Row: {
          abbrev: string | null
          abstract: string | null
          abstract_embedding: string | null
          authors: string[] | null
          code_url: string | null
          created_at: string | null
          id: string | null
          normalized_title: string | null
          pdf_url: string | null
          status: string | null
          title: string | null
          venue_id: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "papers_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_final_papers_personal: {
        Row: {
          abbrev: string | null
          abstract: string | null
          abstract_embedding: string | null
          authors: string[] | null
          code_url: string | null
          created_at: string | null
          id: string | null
          is_liked: boolean | null
          normalized_title: string | null
          pdf_url: string | null
          status: string | null
          title: string | null
          user_id: string | null
          venue_id: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "papers_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_final_venues: {
        Row: {
          abbrev: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      query_embeddings: {
        Args: {
          embedding: string
          match_threshold: number
        }
        Returns: {
          abbrev: string | null
          abstract: string | null
          abstract_embedding: string | null
          authors: string[] | null
          code_url: string | null
          created_at: string | null
          id: string | null
          normalized_title: string | null
          pdf_url: string | null
          status: string | null
          title: string | null
          venue_id: string | null
          year: number | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

