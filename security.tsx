import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, AlertTriangle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/security")({
  head: () => ({
    meta: [{ title: "Security & Access Control | Admin" }],
  }),
  component: SecurityControl,
});

interface OAuthConfig {
  provider: string;
  clientId: string;
  clientSecret: string;
  enabled: boolean;
}

function SecurityControl() {
  const [oauthConfigs, setOauthConfigs] = useState<OAuthConfig[]>([
    {
      provider: "Google",
      clientId: "your-google-client-id",
      clientSecret: "••••••••••••",
      enabled: true,
    },
    {
      provider: "Discord",
      clientId: "your-discord-client-id",
      clientSecret: "••••••••••••",
      enabled: true,
    },
  ]);

  const [sessions, setSessions] = useState([
    { id: "1", userId: "user-123", ipAddress: "192.168.1.1", loginTime: "2024-12-17 10:30", lastActivity: "2024-12-17 14:20" },
    { id: "2", userId: "user-456", ipAddress: "192.168.1.100", loginTime: "2024-12-16 09:15", lastActivity: "2024-12-16 15:45" },
  ]);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const revokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    // API call to revoke session
  };

  const toggleOAuthProvider = (index: number) => {
    const updated = [...oauthConfigs];
    updated[index].enabled = !updated[index].enabled;
    setOauthConfigs(updated);
    // API call to update OAuth config
  };

  const grantAdminAccess = async () => {
    if (!adminEmail) {
      setAdminMessage("Please enter an email address");
      return;
    }

    try {
      const response = await fetch("/api/admin/grant-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });

      if (response.ok) {
        setAdminMessage("✅ Admin access granted successfully!");
        setAdminEmail("");
      } else {
        setAdminMessage("❌ Failed to grant admin access. User may not exist.");
      }
    } catch (error) {
      setAdminMessage("❌ Error: " + (error as Error).message);
    }

    // Clear message after 5 seconds
    setTimeout(() => setAdminMessage(""), 5000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security & Access Control</h1>
        <p className="text-gray-600">Manage authentication, sessions, and security settings</p>
      </div>

      {/* OAuth Configuration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          OAuth Integration
        </h2>

        <div className="grid gap-6">
          {oauthConfigs.map((config, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{config.provider}</h3>
                <Button
                  variant={config.enabled ? "default" : "outline"}
                  onClick={() => toggleOAuthProvider(idx)}
                  size="sm"
                >
                  {config.enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client ID</label>
                  <Input value={config.clientId} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Secret</label>
                  <Input value={config.clientSecret} readOnly type="password" className="bg-gray-50" />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                ℹ️ Update OAuth credentials in environment variables and restart the application.
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Session Management */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Session Management
        </h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">IP Address</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Login Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Last Activity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{session.userId}</td>
                    <td className="px-6 py-4 text-gray-600">{session.ipAddress}</td>
                    <td className="px-6 py-4 text-gray-600">{session.loginTime}</td>
                    <td className="px-6 py-4 text-gray-600">{session.lastActivity}</td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => revokeSession(session.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Force Logout
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Grant Admin Access */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Grant Admin Access
        </h2>

        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            Grant admin privileges to a user by their email address.
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Enter user email address"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={grantAdminAccess} className="bg-green-600 hover:bg-green-700">
              Grant Admin
            </Button>
          </div>
          {adminMessage && (
            <div className={`text-sm p-3 rounded mb-3 ${adminMessage.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {adminMessage}
            </div>
          )}
          <p className="text-xs text-gray-500">
            ⚠️ Only grant admin access to trusted individuals. Admins have full platform control.
          </p>
        </Card>
      </div>
    </div>
  );
}
