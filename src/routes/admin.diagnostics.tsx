// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { Activity, Play, ArrowLeft, CircleCheck as CheckCircle2, Circle as XCircle, Terminal } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/diagnostics")({
  head: () => ({ meta: [{ title: "Diagnostics — Admin — Liminal" }, { name: "robots", content: "noindex" }] }),
  component: DiagnosticsPage,
});

type LogEntry = { time: string; level: "info" | "ok" | "error"; message: string };

function DiagnosticsPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((level: LogEntry["level"], message: string) => {
    const entry: LogEntry = { time: new Date().toLocaleTimeString(), level, message };
    setLogs((prev) => [...prev, entry]);
    requestAnimationFrame(() => {
      if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    });
  }, []);

  const runDiagnostics = useCallback(async () => {
    setRunning(true);
    setLogs([]);
    addLog("info", "Starting diagnostics…");

    if (!supabase) {
      addLog("error", "Supabase client is null — env vars missing");
      setSupabaseStatus("error");
      setRunning(false);
      return;
    }

    // Ping test
    const pingStart = performance.now();
    try {
      const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      const elapsed = Math.round(performance.now() - pingStart);
      setPingMs(elapsed);
      if (error) {
        addLog("error", `Supabase ping failed: ${error.message}`);
        setSupabaseStatus("error");
      } else {
        addLog("ok", `Supabase connection OK (${elapsed}ms)`);
        setSupabaseStatus("ok");
      }
    } catch (err) {
      addLog("error", `Connection error: ${String(err)}`);
      setSupabaseStatus("error");
      setRunning(false);
      return;
    }

    // Test profiles table
    addLog("info", "Testing profiles table (read)…");
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      if (error) addLog("error", `profiles read: ${error.message}`);
      else addLog("ok", "profiles read: OK");
    } catch (err) {
      addLog("error", `profiles read exception: ${String(err)}`);
    }

    // Test designs table (custom_orders)
    addLog("info", "Testing designs table (custom_orders read)…");
    try {
      const { error } = await supabase.from("custom_orders").select("id").limit(1);
      if (error) addLog("error", `custom_orders read: ${error.message}`);
      else addLog("ok", "custom_orders read: OK");
    } catch (err) {
      addLog("error", `custom_orders read exception: ${String(err)}`);
    }

    // Test orders table
    addLog("info", "Testing orders table (read)…");
    try {
      const { error } = await supabase.from("orders").select("id").limit(1);
      if (error) addLog("error", `orders read: ${error.message}`);
      else addLog("ok", "orders read: OK");
    } catch (err) {
      addLog("error", `orders read exception: ${String(err)}`);
    }

    addLog("info", "Diagnostics complete.");
    setRunning(false);
  }, [addLog]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-silver/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="font-display font-black text-2xl md:text-3xl">Database Diagnostics</h1>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 border border-border/60 bg-card rounded-lg px-4 py-3">
            <span className={`h-3 w-3 rounded-full ${
              supabaseStatus === "ok" ? "bg-success" : supabaseStatus === "error" ? "bg-destructive" : "bg-muted-foreground"
            }`} />
            <span className="font-mono text-xs uppercase tracking-widest">
              {supabaseStatus === "ok" ? "Supabase Connected" : supabaseStatus === "error" ? "Connection Error" : "Not Tested"}
            </span>
          </div>
          {pingMs !== null && (
            <span className="font-mono text-xs text-silver/60">Ping: {pingMs}ms</span>
          )}
        </div>

        {/* Run button */}
        <button
          onClick={runDiagnostics}
          disabled={running}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-lg hover:opacity-90 disabled:opacity-40 mb-6"
        >
          <Play className="h-4 w-4" /> {running ? "Running…" : "Run Diagnostics"}
        </button>

        {/* Console output */}
        <div className="border border-border/60 bg-card rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/50">
            <Terminal className="h-4 w-4 text-silver/60" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver/60">Console Output</span>
          </div>
          <div ref={consoleRef} className="p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto bg-background">
            {logs.length === 0 ? (
              <p className="text-silver/40">Click "Run Diagnostics" to start…</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-silver/40 shrink-0">{log.time}</span>
                  {log.level === "ok" && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />}
                  {log.level === "error" && <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />}
                  {log.level === "info" && <span className="text-silver/40 shrink-0">›</span>}
                  <span className={log.level === "error" ? "text-destructive" : log.level === "ok" ? "text-success" : "text-silver/80"}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
