import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [{ title: "Moderation & Community | Admin" }],
  }),
  component: Moderation,
});

interface ReportedContent {
  id: string;
  userId: string;
  userName: string;
  contentType: "comment" | "review" | "post";
  content: string;
  reason: "spam" | "toxic" | "inappropriate" | "other";
  reportedAt: string;
  status: "pending" | "reviewed" | "cleared";
}

interface SuspendedUser {
  id: string;
  email: string;
  reason: string;
  suspendedAt: string;
  linkedAccounts: string[];
}

function Moderation() {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    {
      id: "1",
      userId: "user-123",
      userName: "Spammer Joe",
      contentType: "comment",
      content: "Check out my amazing crypto scheme!!!",
      reason: "spam",
      reportedAt: "2024-12-17 10:30",
      status: "pending",
    },
    {
      id: "2",
      userId: "user-456",
      userName: "Toxic Tim",
      contentType: "review",
      content: "This product is terrible and you're all idiots...",
      reason: "toxic",
      reportedAt: "2024-12-16 14:20",
      status: "pending",
    },
  ]);

  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([
    {
      id: "ban-1",
      email: "banned@example.com",
      reason: "Multiple policy violations",
      suspendedAt: "2024-12-10",
      linkedAccounts: ["google-id-123", "discord-id-456"],
    },
  ]);

  const approveContent = (contentId: string) => {
    setReportedContent(
      reportedContent.map((c) =>
        c.id === contentId ? { ...c, status: "cleared" } : c
      )
    );
  };

  const removeContent = (contentId: string) => {
    setReportedContent(reportedContent.filter((c) => c.id !== contentId));
  };

  const suspendUser = (userId: string) => {
    const content = reportedContent.find((c) => c.id === userId);
    if (content) {
      setSuspendedUsers([
        ...suspendedUsers,
        {
          id: `ban-${Date.now()}`,
          email: content.userId,
          reason: "Content violation",
          suspendedAt: new Date().toISOString().split("T")[0],
          linkedAccounts: [],
        },
      ]);
      removeContent(userId);
    }
  };

  const liftSuspension = (userId: string) => {
    setSuspendedUsers(suspendedUsers.filter((u) => u.id !== userId));
  };

  const getReasonBadgeClass = (reason: string) => {
    const colors: Record<string, string> = {
      spam: "bg-blue-100 text-blue-800",
      toxic: "bg-red-100 text-red-800",
      inappropriate: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[reason] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Moderation & Community Management</h1>
        <p className="text-gray-600">Review reported content and manage user violations</p>
      </div>

      {/* Reported Content Queue */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Reported Content Queue
        </h2>

        {reportedContent.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reported content. Your community is healthy!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reportedContent.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.userName}</p>
                    <p className="text-xs text-gray-500">{item.reportedAt}</p>
                  </div>
                  <Badge className={getReasonBadgeClass(item.reason)}>
                    {item.reason}
                  </Badge>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700">{item.content}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => approveContent(item.id)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeContent(item.id)}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => suspendUser(item.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Ban User
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Suspended Users */}
      <div>
        <h2 className="text-xl font-bold mb-4">Banned & Suspended Users</h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Suspended Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Linked Accounts</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suspendedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.reason}</td>
                    <td className="px-6 py-4 text-gray-600">{user.suspendedAt}</td>
                    <td className="px-6 py-4 text-sm">
                      {user.linkedAccounts.length > 0 ? (
                        <span className="text-gray-600">
                          {user.linkedAccounts.join(", ")}
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => liftSuspension(user.id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Lift Ban
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
