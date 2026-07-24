import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async (uid: string | null, sessionUser: User | null) => {
      if (!uid) {
        if (mounted) setIsAdmin(false);
        return;
      }

      // Fast path: check JWT app_metadata for admin role (works even if DB is unreachable)
      const metaRole = sessionUser?.app_metadata?.role;
      if (metaRole === "admin") {
        if (mounted) setIsAdmin(true);
        return;
      }

      // Also check user_roles table in the database
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        if (mounted) setIsAdmin(Boolean(data));
      } catch {
        // If the DB query fails, fall back to metadata check
        if (mounted) setIsAdmin(metaRole === "admin");
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      // Defer Supabase call to avoid deadlock inside the listener
      setTimeout(() => checkAdmin(session?.user?.id ?? null, session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      checkAdmin(session?.user?.id ?? null, session?.user ?? null).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
