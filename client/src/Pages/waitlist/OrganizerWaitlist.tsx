import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventWaitlist, cancelWaitlistEntry } from "./api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type WaitlistEntry = {
  id: string;
  position: number;
  joined_at: string;
  user: { firstname: string; lastname: string; email: string; username: string };
};

export default function OrganizerWaitlist() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    getEventWaitlist(eventId)
      .then((res) => setEntries(res.data))
      .catch(() => toast.error("Failed to load waitlist"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleRemove = async (id: string) => {
    try {
      await cancelWaitlistEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Removed from waitlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Loading waitlist...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/organizer/events")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={14} /> Back to events
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Waitlist
          <span className="text-sm font-normal text-gray-400 ml-2">
            {entries.length} waiting
          </span>
        </h1>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Guest</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-xs font-medium inline-flex items-center justify-center">
                      {e.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {e.user.firstname} {e.user.lastname}
                    <span className="ml-2 text-gray-400 font-normal text-xs">
                      @{e.user.username}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{e.user.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(e.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemove(e.id)}
                      className="text-red-500 hover:text-red-700 text-xs border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No one on the waitlist yet.
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