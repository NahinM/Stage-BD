import { useEffect, useMemo, useState } from "react";
import {
  staticSponsorListings,
  type SponsorListing,
} from "../data/sponsor-data";
import { refreshUserIfNeeded, useUserStore } from "@/store/User/user";

type SponsorshipRequest = {
  id: string;
  artist_id: string;
  sponsor_id: string;
  message: string;
  status: string;
  requested_amount?: number | null;
  created_at: string;
};

export default function SponsorListings() {
  const sponsors = staticSponsorListings;
  const user = useUserStore((state) => state.user);
  const userRoles = useUserStore((state) => state.userRoles);

  const [selectedSponsor, setSelectedSponsor] =
    useState<SponsorListing | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [requests, setRequests] = useState<SponsorshipRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  const username = user?.username || "";

  const isArtist = useMemo(() => {
    return (
      Array.isArray(userRoles) &&
      userRoles.some((role) => String(role).toLowerCase() === "artist")
    );
  }, [userRoles]);

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

  function openRequestModal(sponsor: SponsorListing) {
    if (!username) {
      alert("Please sign in first.");
      return;
    }

    if (!isArtist) {
      alert("Only users with artist role can request sponsorship.");
      return;
    }

    setSelectedSponsor(sponsor);
    setProjectTitle("");
    setRequestedAmount("");
    setMessage("");
    setRequestSent(false);
    setSubmitError("");
  }

  function closeModal() {
    setSelectedSponsor(null);
    setProjectTitle("");
    setRequestedAmount("");
    setMessage("");
    setRequestSent(false);
    setSubmitError("");
    setIsSubmitting(false);
  }

  async function fetchRequests(currentUsername: string) {
    if (!currentUsername || !isArtist) {
      setRequests([]);
      return;
    }

    try {
      setIsLoadingRequests(true);
      setRequestsError("");

      const response = await fetch(
        `/api/adittya/sponsorship-request/${currentUsername}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load requests.");
      }

      setRequests(result.data || []);
    } catch (error) {
      setRequestsError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }

  useEffect(() => {
    loadLoggedInUser();
  }, []);

  useEffect(() => {
    if (username && isArtist) {
      fetchRequests(username);
    } else {
      setRequests([]);
    }
  }, [username, isArtist]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username) {
      setSubmitError("Please sign in first.");
      return;
    }

    if (!isArtist) {
      setSubmitError("Only users with artist role can request sponsorship.");
      return;
    }

    if (!selectedSponsor || !projectTitle.trim() || !message.trim()) {
      setSubmitError("Sponsor, project title, and message are required.");
      return;
    }

    const amountNumber = Number(requestedAmount);

    if (!amountNumber || amountNumber <= 0) {
      setSubmitError("Please enter a valid requested amount.");
      return;
    }

    if (
      amountNumber < selectedSponsor.minBudget ||
      amountNumber > selectedSponsor.maxBudget
    ) {
      setSubmitError(
        `Requested amount must be within ${selectedSponsor.budgetRange}.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/adittya/sponsorship-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artist_username: username,
          requesting_username: username,
          sponsor_name: selectedSponsor.sponsorName,
          requested_amount: amountNumber,
          message: `Project Title: ${projectTitle}\nRequested Amount: ৳${amountNumber.toLocaleString()}\n\n${message}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send sponsorship request.");
      }

      await fetchRequests(username);
      setRequestSent(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatDate(value: string) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function formatAmount(value?: number | null) {
    if (value === null || value === undefined) return "N/A";
    return `৳${Number(value).toLocaleString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Sponsor / Patron Listings
        </h1>

        <p className="mb-2 text-sm text-gray-600">
          Browse potential sponsors and patrons for artist growth, events, and
          creative collaborations.
        </p>

        <p className="mb-4 text-sm text-gray-500">
          Sponsorship request access is available only for artist accounts.
        </p>

        <div className="mb-8 rounded-2xl border bg-white px-5 py-4 text-sm text-gray-700 shadow-sm">
          {userLoading ? (
            <span>Checking signed-in user...</span>
          ) : username && isArtist ? (
            <span>
              Signed in as artist:{" "}
              <span className="font-semibold">{username}</span>
            </span>
          ) : username && !isArtist ? (
            <span>
              Signed in as <span className="font-semibold">{username}</span>,
              but this account does not have artist permission.
            </span>
          ) : (
            <span>Sign in as an artist to request sponsorship.</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {sponsor.sponsorType}
                </span>
                <span className="text-xs text-gray-500">{sponsor.city}</span>
              </div>

              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {sponsor.sponsorName}
              </h2>

              <p className="mb-3 text-sm leading-6 text-gray-700">
                {sponsor.description}
              </p>

              <div className="mb-3">
                <p className="mb-1 text-sm font-medium text-gray-800">
                  Focus Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {sponsor.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800">
                  Budget Range
                </p>
                <p className="text-sm text-gray-600">{sponsor.budgetRange}</p>
              </div>

              <div className="mb-5">
                <p className="mb-1 text-sm font-medium text-gray-800">
                  Preferred Artist Types
                </p>
                <div className="flex flex-wrap gap-2">
                  {sponsor.preferredArtists.map((artistType) => (
                    <span
                      key={artistType}
                      className="rounded-full border px-2 py-1 text-xs text-gray-700"
                    >
                      {artistType}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openRequestModal(sponsor)}
                disabled={!username || !isArtist}
                className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Request Sponsorship
              </button>
            </div>
          ))}
        </div>

        {username && isArtist && (
          <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                My Sponsorship Requests
              </h2>
              <p className="text-sm text-gray-600">
                View only the sponsorship requests submitted by your own artist
                account.
              </p>
            </div>

            {isLoadingRequests ? (
              <p className="text-sm text-gray-600">Loading requests...</p>
            ) : requestsError ? (
              <p className="text-sm text-red-600">{requestsError}</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-gray-600">
                No sponsorship requests found for your artist account.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Message
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Requested Amount
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 whitespace-pre-line">
                          {request.message}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatAmount(request.requested_amount)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(request.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            {!requestSent ? (
              <>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Sponsorship Request Form
                </h2>

                <p className="mb-6 text-sm text-gray-600">
                  Send a sponsorship request to{" "}
                  <span className="font-semibold">
                    {selectedSponsor.sponsorName}
                  </span>
                  .
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Artist Username
                    </label>
                    <div className="w-full rounded-xl border bg-gray-50 px-4 py-2 text-sm text-gray-700">
                      {username}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Sponsor Budget Range
                    </label>
                    <div className="w-full rounded-xl border bg-gray-50 px-4 py-2 text-sm text-gray-700">
                      {selectedSponsor.budgetRange}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                      placeholder="Enter your project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Requested Amount
                    </label>
                    <input
                      type="number"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                      placeholder={`Between ${selectedSponsor.minBudget} and ${selectedSponsor.maxBudget}`}
                      min={selectedSponsor.minBudget}
                      max={selectedSponsor.maxBudget}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Request Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] w-full rounded-xl border px-4 py-3 text-sm outline-none"
                      placeholder="Write why you are requesting sponsorship"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Request"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Request Submitted
                </h2>
                <p className="mb-4 text-sm text-gray-700">
                  Your sponsorship request has been sent to{" "}
                  <span className="font-semibold">
                    {selectedSponsor.sponsorName}
                  </span>
                  .
                </p>
                <p className="mb-6 text-sm text-gray-600">
                  The request has been stored through the backend route.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}