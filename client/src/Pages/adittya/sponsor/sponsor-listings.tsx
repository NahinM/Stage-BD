import { useEffect, useState } from "react";
import { staticSponsorListings } from "../data/sponsor-data";

type SponsorshipRequest = {
  id: string;
  artist_id: string;
  sponsor_id: string;
  message: string;
  status: string;
  created_at: string;
};

export default function SponsorListings() {
  const sponsors = staticSponsorListings;

  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [lookupUsername, setLookupUsername] = useState("sujit_mustafa");
  const [requests, setRequests] = useState<SponsorshipRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  const isArtist = true;

  function openRequestModal(sponsorName: string) {
    setSelectedSponsor(sponsorName);
    setArtistName(lookupUsername || "");
    setProjectTitle("");
    setMessage("");
    setRequestSent(false);
    setSubmitError("");
  }

  function closeModal() {
    setSelectedSponsor(null);
    setProjectTitle("");
    setMessage("");
    setRequestSent(false);
    setSubmitError("");
    setIsSubmitting(false);
  }

  async function fetchRequests(username: string) {
    if (!username) {
      setRequests([]);
      return;
    }

    try {
      setIsLoadingRequests(true);
      setRequestsError("");

      const response = await fetch(
        `/api/adittya/sponsorship-request/${username}`
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
    fetchRequests(lookupUsername);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!artistName || !selectedSponsor || !message) {
      setSubmitError("Artist username, sponsor, and message are required.");
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
          artist_username: artistName,
          sponsor_name: selectedSponsor,
          message: `Project Title: ${projectTitle}\n\n${message}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send sponsorship request.");
      }

      setLookupUsername(artistName);
      await fetchRequests(artistName);
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

        <p className="mb-8 text-sm text-gray-500">
          Sponsorship request access is available only for artist accounts.
        </p>

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
                <p className="text-sm font-medium text-gray-800">Budget Range</p>
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
                onClick={() => openRequestModal(sponsor.sponsorName)}
                className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Request Sponsorship
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Sponsorship Requests
              </h2>
              <p className="text-sm text-gray-600">
                View previously submitted sponsorship requests.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={lookupUsername}
                onChange={(e) => setLookupUsername(e.target.value)}
                placeholder="Enter artist username"
                className="rounded-xl border px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={() => fetchRequests(lookupUsername)}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Load Requests
              </button>
            </div>
          </div>

          {isLoadingRequests ? (
            <p className="text-sm text-gray-600">Loading requests...</p>
          ) : requestsError ? (
            <p className="text-sm text-red-600">{requestsError}</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-gray-600">
              No sponsorship requests found for this artist.
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
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-pre-line">
                        {request.message}
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
                  <span className="font-semibold">{selectedSponsor}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Artist Username
                    </label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                      placeholder="Enter your artist username"
                      required
                    />
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
                  <span className="font-semibold">{selectedSponsor}</span>.
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