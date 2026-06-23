import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({
    meta: [{ title: "Audit Logs | Admin" }],
  }),
  component: AuditLogs,
});

interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-12-17 14:30",
      adminName: "Admin Dave",
      action: "Role Change",
      target: "user-123",
      details: "Changed user role from User to Moderator",
      severity: "info",
    },
    {
      id: "2",
      timestamp: "2024-12-17 13:15",
      adminName: "Admin Sarah",
      action: "OAuth Update",
      target: "Google OAuth",
      details: "Updated Google OAuth client secret",
      severity: "warning",
    },
    {
      id: "3",
      timestamp: "2024-12-17 11:45",
      adminName: "Admin Dave",
      action: "User Suspended",
      target: "user-456",
      details: "Suspended user account due to policy violation",
      severity: "critical",
    },
    {
      id: "4",
      timestamp: "2024-12-17 10:20",
      adminName: "Admin Sarah",
      action: "Content Removed",
      target: "comment-789",
      details: "Removed inappropriate comment from review section",
      severity: "warning",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"all" | "info" | "warning" | "critical">(
    "all",
  );

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getSeverityIcon = (severity: string) => {
    const icons: Record<string, string> = {
      info: "ℹ️",
      warning: "⚠️",
      critical: "🚨",
    };
    return icons[severity] || "•";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="text-gray-600">Track all administrative actions and system events</p>
      </div>

      {/* System Alerts */}
      <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-orange-900">Potential Security Alert</p>
          <p className="text-sm text-orange-800">
            High volume of failed login attempts detected (42 attempts in the last hour from
            multiple IPs).
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by admin name, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Severity Levels</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Admin</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Target</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.adminName}</td>
                  <td className="px-6 py-4 text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{log.target}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}
                    >
                      <span>{getSeverityIcon(log.severity)}</span>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Statistics */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-2xl font-bold">{logs.length}</p>
          <p className="text-sm text-gray-600">Total Events</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter((l) => l.severity === "info").length}
          </p>
          <p className="text-sm text-gray-600">Info Events</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-yellow-600">
            {logs.filter((l) => l.severity === "warning").length}
          </p>
          <p className="text-sm text-gray-600">Warnings</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-red-600">
            {logs.filter((l) => l.severity === "critical").length}
          </p>
          <p className="text-sm text-gray-600">Critical Events</p>
        </Card>
      </div>
    </div>
  );
}
