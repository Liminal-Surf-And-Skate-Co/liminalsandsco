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

interface StructuredLog {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  correlation_id: string;
  user_id?: string;
  request_id?: string;
  [key: string]: unknown;
}

function generateCorrelationId(): string {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

function logStructured(
  level: "info" | "warn" | "error",
  message: string,
  correlationId: string,
  extra?: Record<string, unknown>
): void {
  const log: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    correlation_id: correlationId,
    ...extra,
  };
  console.log(JSON.stringify(log));
}

Deno.serve(async (req: Request) => {
  const correlationId = req.headers.get("X-Correlation-ID") || generateCorrelationId();
  const requestId = `${correlationId}-${crypto.randomUUID().slice(0, 8)}`;

  logStructured("info", "Incoming webhook request", correlationId, {
    method: req.method,
    request_id: requestId,
  });

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { ...corsHeaders, "X-Correlation-ID": correlationId },
    });
  }

  if (req.method !== "POST") {
    logStructured("warn", "Invalid method", correlationId, { method: req.method, request_id: requestId });
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const discordWebhookUrl = Deno.env.get("DISCORD_ORDERS_WEBHOOK_URL");

    if (!discordWebhookUrl) {
      logStructured("error", "Discord webhook URL not configured", correlationId, { request_id: requestId });
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: OrderPayload = await req.json();
    const { orderId, fulfillmentSource, products, totalAmount, pointsEarned, isTest } = body;

    logStructured("info", "Processing order", correlationId, {
      order_id: orderId,
      fulfillment_source: fulfillmentSource,
      total_amount: totalAmount,
      points_earned: pointsEarned,
      request_id: requestId,
    });

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
    logStructured("info", "Sending Discord webhook", correlationId, {
      order_id: orderId,
      request_id: requestId,
    });

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
      const discordError = await discordResponse.text();
      logStructured("error", "Discord webhook failed", correlationId, {
        order_id: orderId,
        status: discordResponse.status,
        error: discordError,
        request_id: requestId,
      });
      return new Response(JSON.stringify({ error: "Failed to send webhook" }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      });
    }

    logStructured("info", "Discord webhook sent successfully", correlationId, {
      order_id: orderId,
      request_id: requestId,
    });

    return new Response(JSON.stringify({ success: true, request_id: requestId }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
    });
  } catch (error) {
    logStructured("error", "Unexpected error in discord-order-webhook", correlationId, {
      error: (error as Error).message,
      request_id: requestId,
    });
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      }
    );
  }
});
