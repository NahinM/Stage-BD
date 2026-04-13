import { useState } from "react";
import { scanCheckin } from "./api";

export default function ScannerPage() {
  const [reservationCode, setReservationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckin = async () => {
    if (!reservationCode.trim()) {
      setErrorMessage("Please enter a reservation code");
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const { data } = await scanCheckin(reservationCode.trim().toUpperCase());

      setSuccessMessage(data?.message || "Check-in successful");
      setReservationCode("");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Check-in failed"
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Scan Ticket</h1>
        <p className="mb-6 text-gray-500">
          Enter reservation code manually for now. Camera QR scanning can be added next.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={reservationCode}
            onChange={(e) => setReservationCode(e.target.value)}
            placeholder="Enter reservation code"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-500"
          />

          <button
            onClick={handleCheckin}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Confirm Check-in"}
          </button>
        </div>

        {successMessage && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}