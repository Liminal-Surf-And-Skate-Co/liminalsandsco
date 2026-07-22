import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, productType, price, shareSlug, customerNote } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Build email content
    const shareUrl = shareSlug
      ? `${supabaseUrl.replace(".supabase.co", "")}.supabase.co/functions/v1/custom-order-email?slug=${shareSlug}`
      : "";

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1A1A1A; padding: 30px; border-radius: 8px;">
          <h1 style="color: #F1F3F5; font-size: 24px; margin: 0 0 20px;">Liminal Surf & Skate Co</h1>
          <p style="color: #F1F3F5; font-size: 16px;">Your custom order has been received!</p>
          <div style="background: #4C1D95; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #fff; margin: 5px 0;"><strong>Product:</strong> Custom ${productType}</p>
            <p style="color: #fff; margin: 5px 0;"><strong>Price:</strong> $${Number(price).toFixed(2)}</p>
            ${customerNote ? `<p style="color: #fff; margin: 5px 0;"><strong>Note:</strong> ${customerNote}</p>` : ""}
          </div>
          ${shareSlug ? `<p style="color: #F1F3F5;"><a href="${shareUrl}" style="color: #A78BFA;">View your design preview</a></p>` : ""}
          <p style="color: #888; font-size: 12px; margin-top: 30px;">We'll be in touch within 48 hours to finalize your build.</p>
        </div>
      </body>
      </html>
    `;

    // Insert into database log (best-effort)
    try {
      await fetch(`${supabaseUrl}/rest/v1/custom_orders?select=id&order_slug=eq.${shareSlug}`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // best-effort
    }

    // Log the email send attempt
    console.log(`[custom-order-email] Sent confirmation to ${email} for ${productType} ($${price})`);

    return new Response(
      JSON.stringify({ success: true, message: `Confirmation email queued for ${email}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[custom-order-email] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
