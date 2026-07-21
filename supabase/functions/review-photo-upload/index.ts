import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.106.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const BUCKET = "review-photos";

// Magic bytes for server-side type validation
const MAGIC: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xff, 0xd8, 0xff])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4e, 0x47])],
  "image/webp": [
    new Uint8Array([0x52, 0x49, 0x46, 0x46]),
  ],
};

function hasMagicBytes(buf: Uint8Array, expected: Uint8Array[]): boolean {
  return expected.some((sig) => {
    if (buf.length < sig.length) return false;
    for (let i = 0; i < sig.length; i++) {
      if (buf[i] !== sig[i]) return false;
    }
    return true;
  });
}

function inferMimeFromMagic(buf: Uint8Array): string | null {
  for (const [mime, sigs] of Object.entries(MAGIC)) {
    if (hasMagicBytes(buf, sigs)) return mime;
  }
  return null;
}

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Missing Supabase env vars");
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) {
      return new Response(
        JSON.stringify({ error: "Missing auth token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const lowerName = file.name.toLowerCase();
    const ext = lowerName.slice(lowerName.lastIndexOf("."));

    // 1. Block dangerous extensions
    const blocked = [".svg", ".svgz", ".html", ".htm", ".xhtml", ".js", ".json", ".xml"];
    if (blocked.some((b) => lowerName.endsWith(b))) {
      return new Response(
        JSON.stringify({ error: "File type not allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Validate extension
    if (!ALLOWED_EXTS.has(ext)) {
      return new Response(
        JSON.stringify({ error: "Invalid file extension. Only .jpg, .jpeg, .png, .webp allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 3. Validate size
    if (file.size > MAX_BYTES) {
      return new Response(
        JSON.stringify({ error: "File too large. Max 5 MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 4. Read first bytes for magic-number validation
    const bytes = new Uint8Array(await file.arrayBuffer());
    const inferred = inferMimeFromMagic(bytes);
    if (!inferred || !ALLOWED_TYPES.has(inferred)) {
      return new Response(
        JSON.stringify({ error: "Invalid file content. Not a recognized JPEG, PNG, or WebP." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 5. Validate that the user has a review row
    const supabase = getSupabaseClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid auth token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const userId = userData.user.id;

    const { data: reviewRow, error: reviewErr } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (reviewErr || !reviewRow) {
      return new Response(
        JSON.stringify({ error: "You must submit a review before uploading photos." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 6. Server-side upload with validated MIME
    const path = `${userId}/${crypto.randomUUID()}${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: inferred,
        upsert: false,
      });
    if (uploadErr) {
      return new Response(
        JSON.stringify({ error: uploadErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ path }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
