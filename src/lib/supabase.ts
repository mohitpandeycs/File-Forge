// Backward-compatible re-export from the new SSR client
// Existing imports like `import { supabase } from '@/lib/supabase'` will continue to work

import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export const supabase: SupabaseClient = createClient()
export const isSupabaseConfigured = !!supabase