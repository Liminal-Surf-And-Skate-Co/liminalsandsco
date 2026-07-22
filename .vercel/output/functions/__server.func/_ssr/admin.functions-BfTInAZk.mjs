import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-5CMgbjCY.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Bi8jBO3l.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
function sanitizeMessage(msg) {
  if (/relation|table|column|constraint|index|postgres|supabase/i.test(msg)) {
    return "Something went wrong. Please try again.";
  }
  return msg;
}
const claimFirstAdmin_createServerFn_handler = createServerRpc({
  id: "d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c",
  name: "claimFirstAdmin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => claimFirstAdmin.__executeServer(opts));
const claimFirstAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(claimFirstAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    count,
    error: countErr
  } = await supabaseAdmin.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "admin");
  if (countErr) throw new Error(sanitizeMessage(countErr.message));
  if ((count ?? 0) > 0) {
    throw new Error("An admin already exists. Ask an existing admin to grant you access.");
  }
  const {
    error: insErr
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: userId,
    role: "admin"
  });
  if (insErr) throw new Error(sanitizeMessage(insErr.message));
  return {
    ok: true
  };
});
const adminExists_createServerFn_handler = createServerRpc({
  id: "8b404eadc272d7d27f48745f2fd105c6bc74772c80d7e5eb87638d43cd197daa",
  name: "adminExists",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminExists.__executeServer(opts));
const adminExists = createServerFn({
  method: "GET"
}).handler(adminExists_createServerFn_handler, async () => {
  const {
    count,
    error
  } = await supabaseAdmin.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "admin");
  if (error) throw new Error(sanitizeMessage(error.message));
  return {
    exists: (count ?? 0) > 0
  };
});
export {
  adminExists_createServerFn_handler,
  claimFirstAdmin_createServerFn_handler
};
