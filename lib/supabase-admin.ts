import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/config";

export function getSupabaseAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getServerEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
