export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          booking_ref: string
          category_id: string | null
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          event_date: string
          event_location: string
          event_time: string
          guests: number
          id: string
          notes: string
          package_id: string | null
          payment_status: string
          photographer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          booking_ref?: string
          category_id?: string | null
          created_at?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string
          event_date: string
          event_location?: string
          event_time?: string
          guests?: number
          id?: string
          notes?: string
          package_id?: string | null
          payment_status?: string
          photographer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_ref?: string
          category_id?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          event_date?: string
          event_location?: string
          event_time?: string
          guests?: number
          id?: string
          notes?: string
          package_id?: string | null
          payment_status?: string
          photographer_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image_url: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          booking_id: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          name: string
          phone: string
          subject: string
          title: string
          type: string
        }
        Insert: {
          body?: string
          booking_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          name?: string
          phone?: string
          subject?: string
          title: string
          type?: string
        }
        Update: {
          body?: string
          booking_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          name?: string
          phone?: string
          subject?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          album_included: boolean
          badge: string | null
          category_id: string | null
          created_at: string
          description: string
          drone_included: boolean
          duration: string
          features: string[]
          id: string
          image_url: string
          is_active: boolean
          name: string
          photographer_id: string | null
          photographers_count: number
          photos_count: number
          price: number
          updated_at: string
          video_included: boolean
        }
        Insert: {
          album_included?: boolean
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          drone_included?: boolean
          duration?: string
          features?: string[]
          id?: string
          image_url?: string
          is_active?: boolean
          name: string
          photographer_id?: string | null
          photographers_count?: number
          photos_count?: number
          price?: number
          updated_at?: string
          video_included?: boolean
        }
        Update: {
          album_included?: boolean
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          drone_included?: boolean
          duration?: string
          features?: string[]
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          photographer_id?: string | null
          photographers_count?: number
          photos_count?: number
          price?: number
          updated_at?: string
          video_included?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "packages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographers"
            referencedColumns: ["id"]
          },
        ]
      }
      photographers: {
        Row: {
          availability: string
          cover_image: string
          created_at: string
          description: string
          email: string
          experience_years: number
          id: string
          is_active: boolean
          is_verified: boolean
          languages: string[]
          location: string
          name: string
          phone: string
          portfolio: string[]
          profile_image: string
          rating: number
          reviews_count: number
          slug: string
          specializations: string[]
          starting_price: number
          updated_at: string
        }
        Insert: {
          availability?: string
          cover_image?: string
          created_at?: string
          description?: string
          email?: string
          experience_years?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[]
          location?: string
          name: string
          phone?: string
          portfolio?: string[]
          profile_image?: string
          rating?: number
          reviews_count?: number
          slug: string
          specializations?: string[]
          starting_price?: number
          updated_at?: string
        }
        Update: {
          availability?: string
          cover_image?: string
          created_at?: string
          description?: string
          email?: string
          experience_years?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[]
          location?: string
          name?: string
          phone?: string
          portfolio?: string[]
          profile_image?: string
          rating?: number
          reviews_count?: number
          slug?: string
          specializations?: string[]
          starting_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          customer_name: string
          id: string
          photographer_id: string | null
          rating: number
          status: string
        }
        Insert: {
          body?: string
          created_at?: string
          customer_name: string
          id?: string
          photographer_id?: string | null
          rating?: number
          status?: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_name?: string
          id?: string
          photographer_id?: string | null
          rating?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "photographers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
