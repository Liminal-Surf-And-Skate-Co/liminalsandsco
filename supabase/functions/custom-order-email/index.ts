import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.106.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENTS = [
  "liminalsurfandskateco60467@gmail.com",
  "contact@liminalsandsco.com",
];

const SUBJECT = "New Custom Product Inquiry";

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
    const body = await req.json();
    const { name, email, phone, product_type, dimensions, materials, budget, notes, deadline } = body;

    if (!name || !email || !product_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, product_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = `
      <h1>New Custom Product Inquiry</h1>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || "—")}</td></tr>
        <tr><td><strong>Product Type</strong></td><td>${escapeHtml(product_type)}</td></tr>
        <tr><td><strong>Dimensions</strong></td><td>${escapeHtml(dimensions || "—")}</td></tr>
        <tr><td><strong>Materials</strong></td><td>${escapeHtml(materials || "—")}</td></tr>
        <tr><td><strong>Budget</strong></td><td>${escapeHtml(budget || "—")}</td></tr>
        <tr><td><strong>Deadline</strong></td><td>${escapeHtml(deadline || "—")}</td></tr>
        <tr><td><strong>Notes</strong></td><td>${escapeHtml(notes || "—")}</td></tr>
      </table>
    `;

    const supabase = getSupabaseClient();
    const { error: emailError } = await supabase.auth.admin.sendEmail({
      email: RECIPIENTS[0],
      subject: SUBJECT,
      html,
    });

    if (emailError) {
      console.error("Email send failed:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry submitted successfully" }),
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
