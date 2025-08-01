export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          created_at: string
          dot_number: string | null
          email: string | null
          id: string
          mc_number: string | null
          name: string
          owner_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          dot_number?: string | null
          email?: string | null
          id?: string
          mc_number?: string | null
          name: string
          owner_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          dot_number?: string | null
          email?: string | null
          id?: string
          mc_number?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          current_vehicle_id: string | null
          email: string | null
          id: string
          license_expiry: string | null
          license_number: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          current_vehicle_id?: string | null
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          current_vehicle_id?: string | null
          email?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_current_vehicle_id_fkey"
            columns: ["current_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      load_matches: {
        Row: {
          ai_insights: Json | null
          carrier_id: string
          compatibility_factors: Json | null
          created_at: string
          distance_km: number | null
          estimated_cost: number | null
          estimated_duration_hours: number | null
          expires_at: string | null
          id: string
          match_score: number
          shipment_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_insights?: Json | null
          carrier_id: string
          compatibility_factors?: Json | null
          created_at?: string
          distance_km?: number | null
          estimated_cost?: number | null
          estimated_duration_hours?: number | null
          expires_at?: string | null
          id?: string
          match_score: number
          shipment_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_insights?: Json | null
          carrier_id?: string
          compatibility_factors?: Json | null
          created_at?: string
          distance_km?: number | null
          estimated_cost?: number | null
          estimated_duration_hours?: number | null
          expires_at?: string | null
          id?: string
          match_score?: number
          shipment_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          available_from: string | null
          available_until: string | null
          capacity_kg: number | null
          city: string | null
          country: string | null
          created_at: string
          equipment_types: string[] | null
          id: string
          is_current: boolean | null
          latitude: number
          longitude: number
          state: string | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          address?: string | null
          available_from?: string | null
          available_until?: string | null
          capacity_kg?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          equipment_types?: string[] | null
          id?: string
          is_current?: boolean | null
          latitude: number
          longitude: number
          state?: string | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          address?: string | null
          available_from?: string | null
          available_until?: string | null
          capacity_kg?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          equipment_types?: string[] | null
          id?: string
          is_current?: boolean | null
          latitude?: number
          longitude?: number
          state?: string | null
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier_id: string | null
          commodity: string
          created_at: string
          delivery_date: string
          destination_city: string
          destination_state: string
          equipment_type: string
          id: string
          origin_city: string
          origin_state: string
          pickup_date: string
          rate: number
          shipper_id: string
          special_requirements: string | null
          status: string
          updated_at: string
          weight: number
        }
        Insert: {
          carrier_id?: string | null
          commodity: string
          created_at?: string
          delivery_date: string
          destination_city: string
          destination_state: string
          equipment_type?: string
          id?: string
          origin_city: string
          origin_state: string
          pickup_date: string
          rate: number
          shipper_id: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          weight: number
        }
        Update: {
          carrier_id?: string | null
          commodity?: string
          created_at?: string
          delivery_date?: string
          destination_city?: string
          destination_state?: string
          equipment_type?: string
          id?: string
          origin_city?: string
          origin_state?: string
          pickup_date?: string
          rate?: number
          shipper_id?: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          company_id: string | null
          created_at: string
          equipment_type: string
          id: string
          license_plate: string | null
          make: string
          model: string
          owner_id: string
          status: string
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          equipment_type?: string
          id?: string
          license_plate?: string | null
          make: string
          model: string
          owner_id: string
          status?: string
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          equipment_type?: string
          id?: string
          license_plate?: string | null
          make?: string
          model?: string
          owner_id?: string
          status?: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_demo_user: {
        Args: {
          user_email: string
          user_password: string
          display_name: string
          user_role: string
        }
        Returns: Json
      }
      setup_demo_profile: {
        Args: { user_email: string; user_role: string; display_name: string }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
