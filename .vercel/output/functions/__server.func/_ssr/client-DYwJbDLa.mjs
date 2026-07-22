import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function resolveEnv() {
  const SUPABASE_URL = "https://ickbmruzgyajupljfrto.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2JtcnV6Z3lhanVwbGpmcnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTQxMjIsImV4cCI6MjA5NzMzMDEyMn0.tL3LrkGDmBUNqTB-COQhMVXVtJvORxnr94EwuR2BcSg";
  return { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };
}
function createSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = resolveEnv();
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
