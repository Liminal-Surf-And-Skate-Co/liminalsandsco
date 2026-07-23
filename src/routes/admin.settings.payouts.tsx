import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, ArrowLeft, CircleCheck as CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/payouts")({
  head: () => ({ meta: [{ title: "Payout Settings — Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: PayoutsSettingsPage,
});

type Payout = {
  id: string;
  amount: number;
  status: "completed" | "pending";
  date: string;
  method: string;
};

const MOCK_PAYOUTS: Payout[] = [
  { id: "1", amount: 2450.0, status: "completed", date: "2025-07-15", method: "Direct Deposit" },
  { id: "2", amount: 1820.5, status: "completed", date: "2025-07-01", method: "Direct Deposit" },
  { id: "3", amount: 980.75, status: "pending", date: "2025-07-22", method: "Direct Deposit" },
  { id: "4", amount: 3100.0, status: "completed", date: "2025-06-15", method: "Direct Deposit" },
];

function PayoutsSettingsPage() {
  const [accountName, setAccountName] = useState("");
  const [routing, setRouting] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!accountName.trim()) e.accountName = "Account name is required";
    if (!/^\d{9}$/.test(routing)) e.routing = "Routing number must be 9 digits";
    if (!/^\d{8,17}$/.test(accountNumber)) e.accountNumber = "Account number must be 8-17 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }
    toast.success("Payout settings saved — Direct Deposit activated");
    setAccountName("");
    setRouting("");
    setAccountNumber("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-silver/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Banknote className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-2xl md:text-3xl">Bank Account & Payouts</h1>
        </div>

        {/* Status banner */}
        <div className="border border-success/40 bg-success/10 rounded-lg p-4 mb-6 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-success" />
          <div>
            <p className="font-bold text-sm text-success">Connected via Stripe</p>
            <p className="text-xs text-silver/60">Active Direct Deposit — payouts process every 2 business days</p>
          </div>
        </div>

        {/* Direct deposit form */}
        <div className="border border-border/60 bg-card rounded-lg p-6 mb-6">
          <h2 className="font-display font-bold text-lg mb-4">Direct Deposit Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">Account Holder Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver rounded-md focus:outline-none focus:border-primary"
              />
              {errors.accountName && <p className="text-[10px] text-destructive mt-1">{errors.accountName}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">Routing Number</label>
                <input
                  type="text"
                  value={routing}
                  onChange={(e) => setRouting(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="021000021"
                  className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver rounded-md focus:outline-none focus:border-primary"
                />
                {errors.routing && <p className="text-[10px] text-destructive mt-1">{errors.routing}</p>}
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-silver/60 mb-1.5">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 17))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-background border border-border/60 text-sm font-mono text-silver rounded-md focus:outline-none focus:border-primary"
                />
                {errors.accountNumber && <p className="text-[10px] text-destructive mt-1">{errors.accountNumber}</p>}
              </div>
            </div>
            <button
              onClick={save}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-lg hover:opacity-90"
            >
              Save Payout Settings
            </button>
          </div>
        </div>

        {/* Payout history */}
        <div className="border border-border/60 bg-card rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40">
            <h2 className="font-display font-bold text-lg">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Method</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-silver/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYOUTS.map((p) => (
                  <tr key={p.id} className="border-t border-border/30 hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-xs text-silver/60">{p.date}</td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">${p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-silver/60">{p.method}</td>
                    <td className="px-4 py-3">
                      {p.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-success">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-warning">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
