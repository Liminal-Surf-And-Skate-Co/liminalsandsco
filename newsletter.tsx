import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Send, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/newsletter")({
  head: () => ({
    meta: [{ title: "Newsletter Management | Admin" }],
  }),
  component: NewsletterAdmin,
});

interface NewsletterCampaign {
  id: string;
  subject: string;
  sentAt: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  status: "draft" | "scheduled" | "sent";
}

function NewsletterAdmin() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([
    {
      id: "1",
      subject: "New Summer Collection Drop",
      sentAt: "2024-12-15",
      recipients: 1250,
      openRate: 42.5,
      clickRate: 18.3,
      status: "sent",
    },
    {
      id: "2",
      subject: "Exclusive Member Discount",
      sentAt: "2024-12-10",
      recipients: 1180,
      openRate: 55.2,
      clickRate: 22.1,
      status: "sent",
    },
  ]);

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const saveDraft = () => {
    // Save draft logic
    alert("Draft saved!");
  };

  const sendCampaign = () => {
    // Send campaign logic
    alert("Campaign sent to subscribers!");
    setSubject("");
    setContent("");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Mail className="w-8 h-8" />
          Newsletter Management
        </h1>
        <p className="text-gray-600">Create and manage email campaigns</p>
      </div>

      {/* Create Campaign */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold mb-4">New Campaign</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject Line</label>
            <Input
              placeholder="Enter newsletter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              placeholder="Write your newsletter content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-sans text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveDraft}>
              Save as Draft
            </Button>
            <Button onClick={sendCampaign} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Send to All Subscribers
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaign History */}
      <div>
        <h2 className="text-xl font-bold mb-4">Campaign History</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Sent Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Recipients</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Open Rate</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Click Rate</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{campaign.subject}</td>
                    <td className="px-6 py-4 text-gray-600">{campaign.sentAt}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {campaign.recipients.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{campaign.openRate}%</td>
                    <td className="px-6 py-4 text-gray-600">{campaign.clickRate}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Subscriber Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-3xl font-bold text-blue-600">1,250</p>
          <p className="text-sm text-gray-600 mt-1">Total Subscribers</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-green-600">98.4%</p>
          <p className="text-sm text-gray-600 mt-1">Avg. Open Rate</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-purple-600">20.2%</p>
          <p className="text-sm text-gray-600 mt-1">Avg. Click Rate</p>
        </Card>
      </div>
    </div>
  );
}
