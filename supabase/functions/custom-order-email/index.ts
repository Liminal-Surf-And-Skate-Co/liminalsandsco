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

// Structured logging with correlation ID
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

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Missing Supabase env vars");
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

Deno.serve(async (req: Request) => {
  const correlationId = req.headers.get("X-Correlation-ID") || generateCorrelationId();
  const requestId = `${correlationId}-${crypto.randomUUID().slice(0, 8)}`;

  logStructured("info", "Incoming request", correlationId, {
    method: req.method,
    url: req.url,
    request_id: requestId,
  });

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { ...corsHeaders, "X-Correlation-ID": correlationId },
    });
  }

  if (req.method !== "POST") {
    logStructured("warn", "Method not allowed", correlationId, {
      method: req.method,
      request_id: requestId,
    });
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, product_type, dimensions, materials, budget, notes, deadline } = body;

    if (!name || !email || !product_type) {
      logStructured("warn", "Missing required fields", correlationId, {
        request_id: requestId,
        provided_fields: Object.keys(body),
      });
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, product_type" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-Correlation-ID": correlationId,
          },
        }
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
    logStructured("info", "Sending email", correlationId, {
      request_id: requestId,
      email: email,
      recipient_count: RECIPIENTS.length,
    });

    const { error: emailError } = await supabase.auth.admin.sendEmail({
      email: RECIPIENTS[0],
      subject: SUBJECT,
      html,
    });

    if (emailError) {
      logStructured("error", "Email send failed", correlationId, {
        request_id: requestId,
        error: emailError.message,
        email: email,
      });
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
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

    logStructured("info", "Email sent successfully", correlationId, {
      request_id: requestId,
      email: email,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry submitted successfully", request_id: requestId }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      }
    );
  } catch (err) {
    logStructured("error", "Unexpected error", correlationId, {
      request_id: requestId,
      error: (err as Error).message,
    });
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
