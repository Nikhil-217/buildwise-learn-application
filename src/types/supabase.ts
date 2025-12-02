export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string
          area: number
          floors: number
          quality: 'basic' | 'standard' | 'premium'
          project_data: Json
          materials_total: number
          labor_total: number
          total_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          location: string
          area: number
          floors: number
          quality: 'basic' | 'standard' | 'premium'
          project_data: Json
          materials_total: number
          labor_total: number
          total_cost: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          location?: string
          area?: number
          floors?: number
          quality?: 'basic' | 'standard' | 'premium'
          project_data?: Json
          materials_total?: number
          labor_total?: number
          total_cost?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          area: number
          floors: number
          bedrooms: number
          bathrooms: number
          kitchens: number
          halls: number
          quality: 'basic' | 'standard' | 'premium'
          estimated_cost: number
          template_data: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          area: number
          floors: number
          bedrooms: number
          bathrooms: number
          kitchens: number
          halls: number
          quality: 'basic' | 'standard' | 'premium'
          estimated_cost: number
          template_data: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          area?: number
          floors?: number
          bedrooms?: number
          bathrooms?: number
          kitchens?: number
          halls?: number
          quality?: 'basic' | 'standard' | 'premium'
          estimated_cost?: number
          template_data?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      material_rates: {
        Row: {
          id: string
          location: string
          material_type: string
          rate: number
          unit: string
          last_updated: string
          source: string
        }
        Insert: {
          id?: string
          location: string
          material_type: string
          rate: number
          unit: string
          last_updated?: string
          source: string
        }
        Update: {
          id?: string
          location?: string
          material_type?: string
          rate?: number
          unit?: string
          last_updated?: string
          source?: string
        }
      }
      labor_rates: {
        Row: {
          id: string
          location: string
          labor_type: string
          daily_rate: number
          last_updated: string
          source: string
        }
        Insert: {
          id?: string
          location: string
          labor_type: string
          daily_rate: number
          last_updated?: string
          source: string
        }
        Update: {
          id?: string
          location?: string
          labor_type?: string
          daily_rate?: number
          last_updated?: string
          source?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      quality_level: 'basic' | 'standard' | 'premium'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
