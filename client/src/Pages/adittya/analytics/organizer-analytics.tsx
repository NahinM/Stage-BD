import { useEffect, useState } from "react";

type AnalyticsItem = {
  eventId: string;
  eventTitle: string;
  views: number;
  reservations: number;
  attendance: number;
  promoUses: number;
};

export default function OrganizerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch("/api/adittya/analytics");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load analytics.");
      }

      setAnalytics(result.data || []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setAnalytics([]);
    } finally {
      setIsLoading(false);
    }
  }

  const totalEvents = analytics.length;
  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);
  const totalReservations = analytics.reduce(
    (sum, item) => sum + item.reservations,
    0
  );
  const totalAttendance = analytics.reduce(
    (sum, item) => sum + item.attendance,
    0
  );
  const totalPromoUses = analytics.reduce(
    (sum, item) => sum + item.promoUses,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Organizer Analytics Dashboard
        </h1>
        <p className="mb-8 text-sm text-gray-600">
          Overview of event performance, reservations, attendance, and promo
          code usage.
        </p>

        {isLoading ? (
          <p className="text-sm text-gray-600">Loading analytics...</p>
        ) : loadError ? (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Events</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalEvents}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Views</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalViews}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Reservations</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalReservations}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Attendance</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalAttendance}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Promo Uses</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalPromoUses}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Event-wise Breakdown
              </h2>

              {analytics.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No analytics data found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Event
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Views
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Reservations
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Attendance
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Promo Uses
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map((item) => (
                        <tr key={item.eventId} className="border-b last:border-b-0">
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {item.eventTitle}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.views}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.reservations}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.attendance}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.promoUses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}