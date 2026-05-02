import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizerEvents } from "./api";
import { toast } from "sonner";
import { CalendarDays, Users } from "lucide-react";

type OrgEvent = {
  id: string;
  title: string;
  event_date: string;
  seat_limit: number;
  seats_reserved: number;
  status: string;
};

export default function OrganizerEventList() {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrganizerEvents()
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Loading events...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Events</h1>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Event</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Seats</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const seatsLeft = e.seat_limit - e.seats_reserved;
                const isFull = seatsLeft <= 0;
                return (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {new Date(e.event_date).toDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isFull ? (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                          Sold out
                        </span>
                      ) : (
                        <span className="text-gray-500">{seatsLeft} left</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
                        ${e.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/organizer/waitlist/${e.id}`)}
                        className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 hover:border-amber-400 hover:text-amber-700 transition-colors"
                      >
                        <Users size={12} /> Waitlist
                      </button>
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}