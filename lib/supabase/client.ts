import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

// Client-side Supabase client for browser usage
export const supabase = createClientComponentClient()

// Alternative client creation for direct usage
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client with service role (for API routes)
export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
