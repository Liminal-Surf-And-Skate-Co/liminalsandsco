import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderPayload {
  orderId: string;
  fulfillmentSource: "online" | "in-store";
  products: { title: string; variant?: string; quantity: number }[];
  totalAmount: number;
  pointsEarned: number;
  isTest?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const discordWebhookUrl = Deno.env.get("DISCORD_ORDERS_WEBHOOK_URL");

    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: OrderPayload = await req.json();
    const { orderId, fulfillmentSource, products, totalAmount, pointsEarned, isTest } = body;

    // Build embed
    const productLines = products
      .map((p) => `• ${p.title}${p.variant ? ` (${p.variant})` : ""} x${p.quantity}`)
      .join("\n");

    const embed = {
      title: isTest ? "[SANDBOX TEST] New Order Received" : "New Order Received",
      description: "",
      color: fulfillmentSource === "in-store" ? 0x4ade80 : 0x3b82f6,
      fields: [
        {
          name: "Order ID",
          value: `\`${orderId}\``,
          inline: true,
        },
        {
          name: "Fulfillment Source",
          value: fulfillmentSource === "in-store" ? "In-Store (POS)" : "Online",
          inline: true,
        },
        {
          name: "Total",
          value: `$${totalAmount.toFixed(2)} AUD`,
          inline: true,
        },
        {
          name: "Points Earned",
          value: `+${pointsEarned} pts`,
          inline: true,
        },
        {
          name: "Products",
          value: productLines || "No items",
        },
      ],
      footer: {
        text: "Liminal Surf & Skate Co — Liam the Llama",
        icon_url: "https://liminalsandsco.lovable.app/liminal-logo.png",
      },
      timestamp: new Date().toISOString(),
    };

    // Send to Discord
    const discordResponse = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Liam the Llama",
        avatar_url: "https://liminalsandsco.lovable.app/liminal-logo.png",
        embeds: [embed],
      }),
    });

    if (!discordResponse.ok) {
      console.error("Discord webhook failed:", await discordResponse.text());
      return new Response(JSON.stringify({ error: "Failed to send webhook" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in discord-order-webhook:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
