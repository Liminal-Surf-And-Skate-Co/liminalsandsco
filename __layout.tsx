import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin - this would connect to your auth system
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/auth/admin-status");
        if (response.ok) {
          const { isAdmin } = await response.json();
          setIsAdmin(isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You don't have admin privileges to access this area.</p>
        <Button onClick={() => navigate({ to: "/" })}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your platform</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/admin/users" label="User Management" icon="👥" />
          <NavLink to="/admin/security" label="Security & Access" icon="🔒" />
          <NavLink to="/admin/moderation" label="Moderation" icon="⚖️" />
          <NavLink to="/admin/audit-logs" label="Audit Logs" icon="📋" />
          <NavLink to="/admin/newsletter" label="Newsletter" icon="📧" />
          <NavLink to="/admin/products" label="Products" icon="📦" />
          <NavLink to="/admin/events" label="Events" icon="🎪" />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start text-white border-gray-700 hover:bg-gray-800"
            onClick={() => {
              // Handle logout
              navigate({ to: "/" });
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-8 py-4">
          <p className="text-lg font-semibold text-silver">Welcome to Liminal Surf & Skate Co Admin Panel!</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

function NavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <a
      href={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
