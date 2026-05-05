import { useEffect, useMemo, useState } from "react";
import { refreshUserIfNeeded, useUserStore } from "@/store/User/user";

type AnalyticsItem = {
  eventId: string;
  eventTitle: string;
  reservations: number;
  promoUses: number;
  uniqueUsers: number;
  promoCodeIds: string[];
  reservationCodes: string[];
};

export default function OrganizerAnalytics() {
  const user = useUserStore((state) => state.user);
  const userRoles = useUserStore((state) => state.userRoles);

  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const username = user?.username || "";

  const isOrganizer = useMemo(() => {
    return (
      Array.isArray(userRoles) &&
      userRoles.some((role) => String(role).toLowerCase() === "organizer")
    );
  }, [userRoles]);

  useEffect(() => {
    loadLoggedInUser();
  }, []);

  useEffect(() => {
    if (!userLoading) {
      fetchAnalytics();
    }
  }, [userLoading, username, isOrganizer]);

  async function loadLoggedInUser() {
    try {
      setUserLoading(true);
      await refreshUserIfNeeded();
    } catch (error) {
      console.error("Failed to refresh logged-in user:", error);
    } finally {
      setUserLoading(false);
    }
  }

  async function fetchAnalytics() {
    if (!username) {
      setAnalytics([]);
      setIsLoading(false);
      setLoadError("");
      return;
    }

    if (!isOrganizer) {
      setAnalytics([]);
      setIsLoading(false);
      setLoadError("");
      return;
    }

    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch(
        `/api/adittya/analytics?username=${encodeURIComponent(username)}`
      );
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

  const totalReservations = analytics.reduce(
    (sum, item) => sum + item.reservations,
    0
  );

  const totalPromoUses = analytics.reduce(
    (sum, item) => sum + item.promoUses,
    0
  );

  const eventsWithReservations = analytics.filter(
    (item) => item.reservations > 0
  ).length;

  const totalUniqueUsers = analytics.reduce(
    (sum, item) => sum + item.uniqueUsers,
    0
  );

  function renderList(values: string[]) {
    if (!values || values.length === 0) return "None";

    return values.slice(0, 5).join(", ") + (values.length > 5 ? " ..." : "");
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-600">Checking signed-in user...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Organizer Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Please sign in as an organizer to view organizer analytics.
          </p>
        </div>
      </div>
    );
  }

  if (!isOrganizer) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Organizer Analytics Dashboard
          </h1>
          <p className="text-sm text-red-600">
            Access denied. Only users with organizer role can view this
            dashboard.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Signed in as: <span className="font-semibold">{username}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Organizer Analytics Dashboard
        </h1>

        <p className="mb-2 text-sm text-gray-600">
          Overview of your own events, reservations, reserving users, and promo
          code usage based on existing database records.
        </p>

        <p className="mb-8 text-sm text-gray-500">
          Signed in as organizer:{" "}
          <span className="font-semibold">{username}</span>
        </p>

        {isLoading ? (
          <p className="text-sm text-gray-600">Loading analytics...</p>
        ) : loadError ? (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">My Total Events</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalEvents}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Reservations</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalReservations}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Promo Code Uses</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalPromoUses}
                </h2>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  My Events With Reservations
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  {eventsWithReservations}
                </h2>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Unique Reserving Users</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {totalUniqueUsers}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                This is calculated only from reservations made for your own
                events.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                My Event-wise Breakdown
              </h2>

              {analytics.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No event or reservation data found for your organizer account.
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
                          Reservations
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Promo Uses
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Unique Users
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Promo Code IDs Used
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Reservation Codes
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {analytics.map((item) => (
                        <tr
                          key={item.eventId}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {item.eventTitle}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.reservations}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.promoUses}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.uniqueUsers}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {renderList(item.promoCodeIds)}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {renderList(item.reservationCodes)}
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