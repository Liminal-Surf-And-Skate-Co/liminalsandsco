// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck, Check, Clock, CircleAlert as AlertCircle, RotateCcw, FileText, ExternalLink, ChevronDown, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [{ title: "My Orders — Liminal Surf & Skate Co" }],
  }),
  component: OrdersPage,
});

interface OrderItem {
  id: string;
  order_id: string;
  product_slug: string;
  product_title: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  total_amount: number;
  status: string;
  fulfillment_source: string;
  tracking_link: string | null;
  invoice_pdf_url: string | null;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-500",
  processing: "text-blue-500",
  shipped: "text-purple-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
  returned: "text-silver/70",
};

export function OrdersPage() {
  const { user, loading } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []) as Order[];
    },
    enabled: !!user,
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center font-mono text-sm text-silver/60">
          {!user && !loading ? "Sign in to view your orders" : "Loading..."}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-4xl">My Orders</h1>
        </div>

        {isLoading ? (
          <p className="font-mono text-xs text-silver/60">Loading orders...</p>
        ) : !orders || orders.length === 0 ? (
          <div className="border border-border/60 bg-card p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-silver/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-display font-black text-lg text-silver">LL</span>
            </div>
            <p className="font-display font-bold text-xl mb-2 text-silver">No orders yet.</p>
            <p className="font-mono text-sm text-silver/70 mb-6 italic">
              "Liam's watching an empty history. Make history."
            </p>
            <Link
              to="/shop"
              className="inline-block font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 hover:opacity-90"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrder === order.id}
                onToggle={() => setExpandedOrder((id) => (id === order.id ? null : order.id))}
                onStartReturn={() => setReturnOrderId(order.id)}
              />
            ))}
          </div>
        )}

        {/* Return modal */}
        {returnOrderId && (
          <ReturnModal
            orderId={returnOrderId}
            onClose={() => setReturnOrderId(null)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onStartReturn,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onStartReturn: () => void;
}) {
  const formatDate = (d: string) => {
    try {
      return format(parseISO(d), "MMM d, yyyy");
    } catch {
      return d;
    }
  };

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="border border-border/60 bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-silver/10 flex items-center justify-center">
            <span className="font-mono text-xs text-silver">
              {order.fulfillment_source === "in-store" ? "POS" : "WEB"}
            </span>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-silver/50 mb-1">
              Order #{order.id.slice(0, 8)}
            </p>
            <p className="font-display font-bold">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-xs text-silver/50">${order.total_amount} AUD</p>
            <p className={`font-mono text-xs uppercase tracking-widest ${STATUS_COLORS[order.status] || "text-silver"}`}>
              {order.status}
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 text-silver/50 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/40 p-5">
          {/* Order status timeline */}
          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3">
              Order Status
            </p>
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-silver/10 text-silver/40"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest ${
                        isActive ? "text-primary" : "text-silver/40"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`hidden sm:block absolute h-0.5 w-20 top-4 left-1/2 ${
                          i < currentStepIndex ? "bg-primary" : "bg-silver/20"
                        }`}
                        style={{ transform: "translateX(50%)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50 mb-3">
                Items
              </p>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-silver/80">
                      {item.product_title}
                      {item.variant && <span className="text-silver/50"> ({item.variant})</span>}
                      {" x"}{item.quantity}
                    </span>
                    <span className="font-mono text-silver/60">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
            {order.tracking_link && (
              <a
                href={order.tracking_link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70"
              >
                <ExternalLink className="h-3 w-3" /> Track Package
              </a>
            )}
            {order.invoice_pdf_url && (
              <a
                href={order.invoice_pdf_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
              >
                <FileText className="h-3 w-3" /> Invoice
              </a>
            )}
            {(order.status === "delivered" || order.status === "shipped") && (
              <button
                onClick={onStartReturn}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver/60 hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" /> Start Return / Exchange
              </button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
            <span className="font-mono text-xs text-silver/50">Fulfillment</span>
            <span className="font-mono text-xs text-silver">
              {order.fulfillment_source === "in-store" ? "In-Store (POS)" : "Online"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-silver/50">Total</span>
            <span className="font-display font-bold text-lg">
              ${order.total_amount.toFixed(2)} AUD
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ReturnModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const submitReturn = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would call an edge function
      // to send email and update order status
      console.log("Return requested for order:", orderId, "Reason:", reason);
    },
    onSuccess: () => {
      toast.success("Return request submitted");
      qc.invalidateQueries({ queryKey: ["orders"] });
      setSubmitted(true);
    },
    onError: (e) => toast.error(sanitizeError(e)),
  });

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-border/60 bg-card p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Return Requested</h2>
          <p className="text-sm text-silver/70 mb-6">
            We've received your return request. Check your email for return instructions and a
            prepaid label.
          </p>
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest text-primary hover:opacity-70"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-border/60 bg-card p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-silver/50 hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-display font-bold text-xl mb-4">Start a Return / Exchange</h2>
        <p className="text-sm text-silver/70 mb-4">
          Order #{orderId.slice(0, 8)}
        </p>
        <div className="mb-4">
          <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">
            Reason for return
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border/60 text-sm font-mono text-silver focus:outline-none focus:border-primary"
          >
            <option value="">Select a reason</option>
            <option value="wrong_size">Wrong size</option>
            <option value="not_as_expected">Not as expected</option>
            <option value="defective">Defective / damaged</option>
            <option value="changed_mind">Changed my mind</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-silver/50">
            Return Policy
          </p>
          <p className="text-xs text-silver/60 mt-1">
            Items must be unworn, unwashed, and in original packaging. See our{" "}
            <Link to="/legal/returns" className="text-primary hover:underline">
              Returns Policy
            </Link>{" "}
            for full details.
          </p>
        </div>
        <button
          onClick={() => submitReturn.mutate()}
          disabled={!reason || submitReturn.isPending}
          className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 hover:opacity-90 disabled:opacity-50"
        >
          {submitReturn.isPending ? "Submitting..." : "Submit Return Request"}
        </button>
      </div>
    </div>
  );
}