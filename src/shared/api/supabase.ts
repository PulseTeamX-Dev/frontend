import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/shared/lib/constants";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const token = localStorage.getItem("access_token");

await supabase.auth.setSession({
  access_token: token!,
  refresh_token: localStorage.getItem("refresh_token")!,
});
