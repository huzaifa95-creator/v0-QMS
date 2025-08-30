export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "admin" | "manager" | "sales" | "procurement" | "viewer"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: "admin" | "manager" | "sales" | "procurement" | "viewer"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "admin" | "manager" | "sales" | "procurement" | "viewer"
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          tax_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          tax_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          tax_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          tax_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          tax_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          tax_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          sku: string | null
          unit_price: number
          category: string | null
          unit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          sku?: string | null
          unit_price: number
          category?: string | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          sku?: string | null
          unit_price?: number
          category?: string | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
