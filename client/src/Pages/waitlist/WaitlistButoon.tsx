import { useEffect, useState } from "react";
import { joinWaitlist, getWaitlistPosition } from "./api";

type Props = {
  eventId: string;
  isFull: boolean; // pass seats_reserved >= seat_limit from parent
};

export default function WaitlistButton({ eventId, isFull }: Props) {
  const [position, setPosition] = useState<number | null>(null);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isFull) return;
    getWaitlistPosition(eventId)
      .then((res) => {
        if (res.data.onWaitlist) {
          setPosition(res.data.position);
          setWaitlistId(res.data.id);
        }
      })
      .catch(() => {});
  }, [eventId, isFull]);

  if (!isFull) return null;

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await joinWaitlist(eventId);
      setPosition(res.data.data.position);
      setWaitlistId(res.data.data.id);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to join waitlist");
    } finally {
      setLoading(false);
    }
  };

  if (position) {
    return (
      <button disabled className="w-full rounded-xl bg-amber-50 border border-amber-300 text-amber-800 px-4 py-2 font-medium cursor-default">
        ⏳ You're #{position} on the waitlist
      </button>
    );
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="w-full rounded-xl bg-amber-100 border border-amber-400 text-amber-900 px-4 py-2 font-medium hover:bg-amber-200"
    >
      {loading ? "Joining..." : "Join waitlist"}
    </button>
  );
}