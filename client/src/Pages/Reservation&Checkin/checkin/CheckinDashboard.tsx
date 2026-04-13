import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchEventCheckins,
  scanCheckin,
  searchEventGuests,
  manualCheckinByReservation,
} from "./api";

type CheckinItem = {
  id: string;
  reservation_id: string;
  staff_id: string | null;
  checked_in_at: string;
  event_id: string;
  reservation_code?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
};

type SearchGuestItem = {
  reservation_id: string;
  event_id: string;
  status: string;
  reservation_code?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Mode = "qr" | "manual" | "find";

export default function CheckinDashboard() {
  const eventId = "30bbd4b7-871b-4e5d-81f1-f1e436d96b69";

  const [checkins, setCheckins] = useState<CheckinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showActionPanel, setShowActionPanel] = useState(false);
  const [mode, setMode] = useState<Mode>("qr");

  const [reservationCode, setReservationCode] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanError, setScanError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchGuestItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadCheckins = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await fetchEventCheckins(eventId);
      setCheckins(data.checkins || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load check-ins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckins();
  }, [eventId]);

  useEffect(() => {
    if (showActionPanel && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showActionPanel, mode]);

  const resetMessages = () => {
    setScanMessage("");
    setScanError("");
  };

  const toggleActionPanel = () => {
    setShowActionPanel((prev) => !prev);
    resetMessages();
    setReservationCode("");
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleManualCheckin = async () => {
    if (!reservationCode.trim()) {
      setScanError("Please enter a reservation code");
      setScanMessage("");
      return;
    }

    try {
      setScanLoading(true);
      resetMessages();

      const { data } = await scanCheckin(reservationCode.trim().toUpperCase());

      setScanMessage(data?.message || "Check-in successful");
      setReservationCode("");
      await loadCheckins();
    } catch (err: any) {
      console.error(err);
      setScanError(err?.response?.data?.message || "Failed to check in guest");
      setScanMessage("");
    } finally {
      setScanLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const { data } = await searchEventGuests(eventId, searchQuery.trim());
      setSearchResults(data.guests || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleManualCheckinFromSearch = async (reservationId: string) => {
    try {
      setScanLoading(true);
      resetMessages();

      const { data } = await manualCheckinByReservation(reservationId);

      setScanMessage(data?.message || "Manual check-in successful");
      await loadCheckins();
      await handleSearch();
    } catch (err: any) {
      console.error(err);
      setScanError(err?.response?.data?.message || "Manual check-in failed");
    } finally {
      setScanLoading(false);
    }
  };

  const totalCheckedIn = useMemo(() => checkins.length, [checkins]);
  const latestGuest = useMemo(() => checkins[0] || null, [checkins]);

  const getGuestName = (guest: {
    firstname?: string | null;
    lastname?: string | null;
    username?: string | null;
  }) => {
    const fullName = `${guest.firstname || ""} ${guest.lastname || ""}`.trim();
    return fullName || guest.username || "Guest";
  };

  const formatDate = (date: string) => new Date(date).toLocaleString();

  if (loading) {
    return <div className="p-8 text-lg font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Organizer Check-in Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              QR scan, manual code entry, and guest search fallback
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleActionPanel}
              className="rounded-xl bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
              {showActionPanel ? "Close Check-in Tools" : "Open Check-in Tools"}
            </button>

            <button
              onClick={loadCheckins}
              className="rounded-xl bg-black px-4 py-2 text-white shadow hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </div>

        {showActionPanel && (
          <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                onClick={() => setMode("qr")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "qr"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Scan QR
              </button>

              <button
                onClick={() => setMode("manual")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "manual"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Manual Code
              </button>

              <button
                onClick={() => setMode("find")}
                className={`rounded-xl px-4 py-2 ${
                  mode === "find"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Find Guest
              </button>
            </div>

            {mode === "qr" && (
              <div className="rounded-xl bg-gray-50 p-5">
                <h2 className="text-xl font-semibold">QR Scanner</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Keep this button and section for the upcoming QR camera scanner.
                  For now, use Manual Code or Find Guest.
                </p>
                <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-gray-500">
                  QR scanner placeholder
                </div>
              </div>
            )}

            {mode === "manual" && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Manual Code Check-in</h2>

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={reservationCode}
                    onChange={(e) => setReservationCode(e.target.value)}
                    placeholder="Enter reservation code"
                    className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-green-500"
                  />

                  <button
                    onClick={handleManualCheckin}
                    disabled={scanLoading}
                    className="rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {scanLoading ? "Checking..." : "Confirm Check-in"}
                  </button>
                </div>
              </div>
            )}

            {mode === "find" && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Find Guest</h2>

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone, or reservation code"
                    className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-green-500"
                  />

                  <button
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="rounded-xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {searchResults.map((guest) => (
                    <div
                      key={guest.reservation_id}
                      className="rounded-xl border p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">
                            {getGuestName(guest)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Code: {guest.reservation_code || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Email: {guest.email || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Phone: {guest.phone || "N/A"}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleManualCheckinFromSearch(guest.reservation_id)
                          }
                          disabled={scanLoading}
                          className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Check In
                        </button>
                      </div>
                    </div>
                  ))}

                  {!searchLoading &&
                    searchQuery.trim() &&
                    searchResults.length === 0 && (
                      <div className="rounded-xl border border-dashed p-4 text-gray-500">
                        No guests found for this event.
                      </div>
                    )}
                </div>
              </div>
            )}

            {scanMessage && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">
                {scanMessage}
              </div>
            )}

            {scanError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
                {scanError}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Checked In</p>
            <h2 className="mt-2 text-4xl font-bold text-green-600">
              {totalCheckedIn}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Event ID</p>
            <h2 className="mt-2 break-all text-sm font-semibold text-gray-800">
              {eventId}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Latest Arrival</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {latestGuest ? getGuestName(latestGuest) : "No arrivals yet"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}