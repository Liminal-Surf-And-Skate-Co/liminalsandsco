import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// ── Safe Supabase client initialization ──────────────────────
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function createSafeSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    console.warn("[supabase] Missing env vars — running in offline mode.");
    return null;
  }

  try {
    return createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  } catch (err) {
    console.error("[supabase] Failed to initialize client:", err);
    return null;
  }
}

export const supabase = createSafeSupabase();

// ── Global ErrorBoundary ─────────────────────────────────────
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[GlobalErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-display font-black text-3xl text-foreground">
              Something went wrong
            </h1>
            <p className="text-silver text-sm">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Lazy-loaded route components with fallback ───────────────
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./routes/index"));
const DesignStudioPage = lazy(() => import("./routes/design-studio"));
const GaragePage = lazy(() => import("./routes/account/garage"));
const AdminOrdersPage = lazy(() => import("./routes/admin/custom-orders"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-silver">
          Loading…
        </p>
      </div>
    </div>
  );
}

// ── Router setup ─────────────────────────────────────────────
const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => <Outlet />,
  errorComponent: ({ error }: { error: Error }) => (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-foreground">
          Failed to load
        </h2>
        <p className="text-silver text-sm">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
        >
          Retry
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-foreground">
          404 — Page not found
        </h2>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
        >
          Go Home
        </button>
      </div>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<RouteFallback />}>
      <HomePage />
    </Suspense>
  ),
});

const designStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/design-studio",
  component: () => (
    <Suspense fallback={<RouteFallback />}>
      <DesignStudioPage />
    </Suspense>
  ),
});

const garageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/garage",
  component: () => (
    <Suspense fallback={<RouteFallback />}>
      <GaragePage />
    </Suspense>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/custom-orders",
  component: () => (
    <Suspense fallback={<RouteFallback />}>
      <AdminOrdersPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  designStudioRoute,
  garageRoute,
  adminOrdersRoute,
]);

// ── Chunk load failure recovery ──────────────────────────────
window.addEventListener("error", (e) => {
  if (
    e.message?.includes("Failed to fetch dynamically imported module") ||
    e.message?.includes("Importing a module script failed")
  ) {
    console.error("[chunk] Dynamic import failed — reloading page.");
    window.location.reload();
  }
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { queryClient },
});

// Type registration
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
