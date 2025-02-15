export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      papers: {
        Row: {
          abstract: string | null;
          abstract_embedding: string | null;
          authors: string[] | null;
          code_url: string | null;
          created_at: string | null;
          id: string;
          normalized_title: string | null;
          pdf_url: string | null;
          status: string | null;
          title: string;
          venue_id: string | null;
        };
        Insert: {
          abstract?: string | null;
          abstract_embedding?: string | null;
          authors?: string[] | null;
          code_url?: string | null;
          created_at?: string | null;
          id?: string;
          normalized_title?: string | null;
          pdf_url?: string | null;
          status?: string | null;
          title: string;
          venue_id?: string | null;
        };
        Update: {
          abstract?: string | null;
          abstract_embedding?: string | null;
          authors?: string[] | null;
          code_url?: string | null;
          created_at?: string | null;
          id?: string;
          normalized_title?: string | null;
          pdf_url?: string | null;
          status?: string | null;
          title?: string;
          venue_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "papers_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      search_logs: {
        Row: {
          created_at: string | null;
          id: number;
          search_query: string;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          search_query: string;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          search_query?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          abbrev: string | null;
          created_at: string | null;
          id: string;
          name: string;
          year: number;
        };
        Insert: {
          abbrev?: string | null;
          created_at?: string | null;
          id?: string;
          name: string;
          year: number;
        };
        Update: {
          abbrev?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          year?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      vw_final_papers: {
        Row: {
          abbrev: string | null;
          abstract: string | null;
          abstract_embedding: string | null;
          authors: string[] | null;
          code_url: string | null;
          created_at: string | null;
          id: string | null;
          normalized_title: string | null;
          pdf_url: string | null;
          status: string | null;
          title: string | null;
          venue_id: string | null;
          year: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "papers_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      vw_final_venues: {
        Row: {
          abbrev: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      query_embeddings: {
        Args: {
          embedding: string;
          match_threshold: number;
        };
        Returns: {
          abbrev: string | null;
          abstract: string | null;
          abstract_embedding: string | null;
          authors: string[] | null;
          code_url: string | null;
          created_at: string | null;
          id: string | null;
          normalized_title: string | null;
          pdf_url: string | null;
          status: string | null;
          title: string | null;
          venue_id: string | null;
          year: number | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

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
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
