import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function sanitizeMessage(msg: string): string {
  if (/relation|table|column|constraint|index|postgres|supabase/i.test(msg)) {
    return "Something went wrong. Please try again.";
  }
  return msg;
}

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(sanitizeMessage(error.message));
  if (!data) throw new Error("Admin access required.");
}

/**
 * Bootstrap helper: lets the very first signed-in user claim the admin role,
 * but only when zero admins exist. Safe to expose because it self-disables
 * after the first admin is created.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(sanitizeMessage(countErr.message));
    if ((count ?? 0) > 0) {
      throw new Error("An admin already exists. Ask an existing admin to grant you access.");
    }
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (insErr) throw new Error(sanitizeMessage(insErr.message));
    return { ok: true };
  });

/** Returns whether any admin exists — used to show/hide the bootstrap button. */
export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(sanitizeMessage(error.message));
  return { exists: (count ?? 0) > 0 };
});

export type AdminUserRow = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

/** Lists auth users joined with their public.user_roles entries. Admin-only. */
export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.userId);

    const { data: users, error: usersErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (usersErr) throw new Error(sanitizeMessage(usersErr.message));

    const { data: roles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rolesErr) throw new Error(sanitizeMessage(rolesErr.message));

    const rolesByUser = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role);
      rolesByUser.set(r.user_id, list);
    }

    return (users?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      roles: rolesByUser.get(u.id) ?? [],
    }));
  });

/** Grants a role (default: admin) to a user by email or user_id. Admin-only. */
export const grantAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email?: string; userId?: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    let targetId = data.userId?.trim() || "";
    if (!targetId && data.email) {
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      if (error) throw new Error(sanitizeMessage(error.message));
      const match = users.users.find(
        (u) => (u.email ?? "").toLowerCase() === data.email!.trim().toLowerCase(),
      );
      if (!match) throw new Error("No user found with that email.");
      targetId = match.id;
    }
    if (!targetId) throw new Error("Provide an email or user ID.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: targetId, role: "admin" });
    if (error && !/duplicate key|unique constraint/i.test(error.message)) {
      throw new Error(sanitizeMessage(error.message));
    }
    return { ok: true, userId: targetId };
  });

/** Revokes admin role from a user. Admin-only. Prevents self-revoke and last-admin removal. */
export const revokeAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.userId === context.userId) {
      throw new Error("You can't revoke your own admin role.");
    }
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) <= 1) {
      throw new Error("Can't remove the last admin.");
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(sanitizeMessage(error.message));
    return { ok: true };
  });
