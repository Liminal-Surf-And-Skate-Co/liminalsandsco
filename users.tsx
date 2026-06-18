import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{ title: "User Management | Admin" }],
  }),
  component: UserManagement,
});

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  authProvider: "google" | "discord" | "email";
  status: "active" | "pending" | "suspended" | "banned";
  role: "user" | "writer" | "moderator" | "admin";
  createdAt: string;
  lastLogin: string;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      // Replace with actual API call
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          authProvider: "google",
          status: "active",
          role: "user",
          createdAt: "2024-01-15",
          lastLogin: "2024-12-17",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          username: "janesmith",
          authProvider: "discord",
          status: "active",
          role: "moderator",
          createdAt: "2024-02-20",
          lastLogin: "2024-12-16",
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      // Update local state
      setUsers(users.map(u => u.id === userId ? {...u, role: newRole as any} : u));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Update local state
      setUsers(users.map(u => u.id === userId ? {...u, status: newStatus as any} : u));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getAuthProviderBadge = (provider: string) => {
    const icons: Record<string, string> = {
      google: "🔵",
      discord: "🟣",
      email: "✉️",
    };
    return icons[provider] || "•";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-orange-100 text-orange-800",
      banned: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8" />
          User Management Dashboard
        </h1>
        <p className="text-gray-600">Manage all registered users and their access levels</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Auth Provider</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span title={user.authProvider} className="text-lg">
                      {getAuthProviderBadge(user.authProvider)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Select value={user.status} onValueChange={(val) => updateUserStatus(user.id, val)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    <Select value={user.role} onValueChange={(val) => updateUserRole(user.id, val)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserStatus(user.id, "suspended")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Suspend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Stats */}
      <div className="mt-8 grid grid-cols-5 gap-4">
        <Card className="p-6">
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Users</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-green-600">
            {users.filter((u) => u.status === "active").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Active Users</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-yellow-600">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Admins</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-orange-600">
            {users.filter((u) => u.status === "suspended").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Suspended</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-red-600">
            {users.filter((u) => u.status === "banned").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Banned Users</p>
        </Card>
      </div>
    </div>
  );
}
