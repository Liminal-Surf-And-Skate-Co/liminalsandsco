import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Edit2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [{ title: "Event Management | Admin" }],
  }),
  component: EventsAdmin,
});

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  status: "upcoming" | "active" | "completed";
  description: string;
}

function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Summer Board Shaping Workshop",
      date: "2025-01-15",
      location: "Workshop - Downtown",
      attendees: 24,
      status: "upcoming",
      description: "Learn hand-shaping techniques with our master craftspeople",
    },
    {
      id: "2",
      title: "Community Skate Jam",
      date: "2024-12-20",
      location: "Central Skate Park",
      attendees: 45,
      status: "upcoming",
      description: "Monthly community skateboard competition and hangout",
    },
    {
      id: "3",
      title: "Pop-up Shop: Winter Collection",
      date: "2024-12-10",
      location: "Waterfront Market",
      attendees: 120,
      status: "completed",
      description: "Limited edition winter apparel release",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location) {
      setEvents([
        ...events,
        {
          id: `${events.length + 1}`,
          title: newEvent.title,
          date: newEvent.date,
          location: newEvent.location,
          description: newEvent.description,
          attendees: 0,
          status: "upcoming",
        },
      ]);
      setNewEvent({ title: "", date: "", location: "", description: "" });
      alert("Event created successfully!");
    }
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Event Management
        </h1>
        <p className="text-gray-600">Create and manage community events</p>
      </div>

      {/* Create Event Form */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Event
        </h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <Input
                placeholder="e.g., Summer Workshop"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                placeholder="2025-01-15"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              placeholder="Event location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Event description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full h-24 p-3 border border-gray-300 rounded-lg font-sans text-sm"
            />
          </div>
          <Button onClick={addEvent} className="bg-blue-600 hover:bg-blue-700 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </Card>

      {/* Events List */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Events</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Attendees</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{event.date}</td>
                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                    <td className="px-6 py-4 text-gray-600">{event.attendees}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Event Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Events</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-green-600">
            {events.filter((e) => e.status === "upcoming").length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Upcoming</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-purple-600">
            {events.reduce((sum, e) => sum + e.attendees, 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Attendees</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-yellow-600">
            {Math.round(events.reduce((sum, e) => sum + e.attendees, 0) / events.length)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Avg Attendees</p>
        </Card>
      </div>
    </div>
  );
}
