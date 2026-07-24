import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let initialSettled = false;

    const settleLoading = () => {
      if (!initialSettled && mounted) {
        initialSettled = true;
        setLoading(false);
      }
    };

    const checkAdmin = async (uid: string | null, sessionUser: User | null) => {
      if (!uid) {
        if (mounted) setIsAdmin(false);
        return;
      }

      // Fast path: JWT app_metadata (works even if DB is unreachable)
      const metaRole = sessionUser?.app_metadata?.role;
      if (metaRole === "admin") {
        if (mounted) setIsAdmin(true);
        return;
      }

      // Fallback: user_roles table
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        if (mounted) setIsAdmin(Boolean(data));
      } catch {
        if (mounted) setIsAdmin(metaRole === "admin");
      }
    };

    // Primary path: wait for Supabase's INITIAL_SESSION event before flipping
    // `loading` to false. This prevents the redirect-loop / white-screen flicker
    // that happens when consumers see `loading=false` with a stale user state.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);

      // Defer Supabase calls to avoid deadlocking inside the listener.
      setTimeout(() => {
        if (!mounted) return;
        checkAdmin(session?.user?.id ?? null, session?.user ?? null);
      }, 0);

      // Only resolve `loading` after the initial session (or a real change) is known.
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED" ||
        event === "PASSWORD_RECOVERY"
      ) {
        settleLoading();
      }
    });

    // Safety net: if the Supabase proxy stub returns a no-op (env vars missing
    // → INITIAL_SESSION will *never* fire), we still need loading to settle so
    // the UI doesn't spin forever. Also catches thrown errors.
    try {
      const maybe = supabase.auth.getSession();
      if (maybe && typeof maybe.then === "function") {
        maybe
          .then(() => settleLoading())
          .catch((err: unknown) => {
            // eslint-disable-next-line no-console
            console.error("[useAuth] getSession failed:", err);
            settleLoading();
          });
      } else {
        settleLoading();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[useAuth] getSession threw synchronously:", err);
      settleLoading();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
