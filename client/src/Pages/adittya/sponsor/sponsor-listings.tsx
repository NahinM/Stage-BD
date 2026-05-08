import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { refreshUserIfNeeded, useUserStore } from "@/store/User/user";

type SponsorListing = {
  id: string;
  sponsorName: string;
  sponsorUsername: string;
  sponsorType: string;
  focusAreas: string[];
  city: string;
  budgetRange: string;
  minBudget: number;
  maxBudget: number;
  description: string;
  preferredArtists: string[];
  isPublic?: boolean;
};

type SponsorshipRequest = {
  id: string;
  artist_id: string;
  sponsor_id: string;
  artistUsername?: string;
  artistName?: string;
  artistCity?: string;
  sponsorUsername?: string;
  message: string;
  status: string;
  requested_amount?: number | null;
  created_at: string;
};

type ArtistOption = {
  id: string;
  username: string;
  name: string;
  city: string;
  bio: string;
  genres: string;
  image: string;
};

type SponsorProfileForm = {
  sponsorName: string;
  sponsorType: string;
  focusAreas: string;
  city: string;
  minBudget: string;
  maxBudget: string;
  description: string;
  preferredArtists: string;
  isPublic: boolean;
};

const emptySponsorProfileForm: SponsorProfileForm = {
  sponsorName: "",
  sponsorType: "",
  focusAreas: "",
  city: "",
  minBudget: "",
  maxBudget: "",
  description: "",
  preferredArtists: "",
  isPublic: true,
};

function splitCommaText(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinArrayText(value?: string[]) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export default function SponsorListings() {
  const user = useUserStore((state) => state.user);
  const userRoles = useUserStore((state) => state.userRoles);

  const [sponsors, setSponsors] = useState<SponsorListing[]>([]);
  const [selectedSponsor, setSelectedSponsor] =
    useState<SponsorListing | null>(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [artistRequests, setArtistRequests] = useState<SponsorshipRequest[]>(
    []
  );
  const [sponsorRequests, setSponsorRequests] = useState<SponsorshipRequest[]>(
    []
  );

  const [availableArtists, setAvailableArtists] = useState<ArtistOption[]>([]);
  const [selectedArtistUsername, setSelectedArtistUsername] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");

  const [sponsorProfileForm, setSponsorProfileForm] =
    useState<SponsorProfileForm>(emptySponsorProfileForm);
  const [savingSponsorProfile, setSavingSponsorProfile] = useState(false);
  const [sponsorProfileMessage, setSponsorProfileMessage] = useState("");

  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [sponsorsLoading, setSponsorsLoading] = useState(false);

  const username = user?.username || "";

  const isArtist = useMemo(() => {
    return (
      Array.isArray(userRoles) &&
      userRoles.some((role) => String(role).toLowerCase() === "artist")
    );
  }, [userRoles]);

  const isSponsor = useMemo(() => {
    return (
      Array.isArray(userRoles) &&
      userRoles.some((role) => String(role).toLowerCase() === "sponsor")
    );
  }, [userRoles]);

  useEffect(() => {
    loadLoggedInUser();
    fetchPublicSponsors();
  }, []);

  useEffect(() => {
    if (!userLoading && username) {
      if (isArtist) {
        fetchArtistRequests(username);
      }

      if (isSponsor) {
        fetchSponsorRequests(username);
        fetchAvailableArtistsForSponsor(username);
        fetchMySponsorProfile(username);
      }
    }
  }, [userLoading, username, isArtist, isSponsor]);

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

  async function fetchPublicSponsors() {
    try {
      setSponsorsLoading(true);

      const response = await fetch("/api/adittya/public-sponsors");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load sponsors.");
      }

      setSponsors(result.data || []);
    } catch (error) {
      console.error("Failed to load public sponsors:", error);
      setSponsors([]);
    } finally {
      setSponsorsLoading(false);
    }
  }

  async function fetchMySponsorProfile(currentUsername: string) {
    try {
      setSponsorProfileMessage("");

      const response = await fetch(
        `/api/adittya/my-sponsor-profile/${encodeURIComponent(
          currentUsername
        )}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load sponsor profile.");
      }

      if (!result.data) {
        setSponsorProfileForm((prev) => ({
          ...prev,
          sponsorName: user?.firstname
            ? `${user.firstname} ${user?.lastname || ""}`.trim()
            : currentUsername,
          city: user?.city || "",
        }));
        return;
      }

      setSponsorProfileForm({
        sponsorName: result.data.sponsorName || "",
        sponsorType: result.data.sponsorType || "",
        focusAreas: joinArrayText(result.data.focusAreas),
        city: result.data.city || "",
        minBudget: String(result.data.minBudget || ""),
        maxBudget: String(result.data.maxBudget || ""),
        description: result.data.description || "",
        preferredArtists: joinArrayText(result.data.preferredArtists),
        isPublic: result.data.isPublic !== false,
      });
    } catch (error) {
      console.error(error);
      setSponsorProfileMessage(
        error instanceof Error ? error.message : "Failed to load sponsor profile."
      );
    }
  }

  async function handleSaveSponsorProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username || !isSponsor) {
      setSponsorProfileMessage("Only sponsor users can create sponsor listings.");
      return;
    }

    const minBudget = Number(sponsorProfileForm.minBudget);
    const maxBudget = Number(sponsorProfileForm.maxBudget);

    if (
      !sponsorProfileForm.sponsorName.trim() ||
      !sponsorProfileForm.description.trim() ||
      !minBudget ||
      !maxBudget
    ) {
      setSponsorProfileMessage(
        "Sponsor name, description, min budget, and max budget are required."
      );
      return;
    }

    if (minBudget <= 0 || maxBudget <= 0 || minBudget > maxBudget) {
      setSponsorProfileMessage("Please enter a valid budget range.");
      return;
    }

    try {
      setSavingSponsorProfile(true);
      setSponsorProfileMessage("");

      const response = await fetch("/api/adittya/my-sponsor-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sponsor_username: username,
          sponsor_name: sponsorProfileForm.sponsorName,
          sponsor_type: sponsorProfileForm.sponsorType,
          focus_areas: splitCommaText(sponsorProfileForm.focusAreas),
          city: sponsorProfileForm.city,
          min_budget: minBudget,
          max_budget: maxBudget,
          description: sponsorProfileForm.description,
          preferred_artists: splitCommaText(sponsorProfileForm.preferredArtists),
          is_public: sponsorProfileForm.isPublic,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save sponsor listing.");
      }

      setSponsorProfileMessage("Sponsor listing saved successfully.");
      await fetchPublicSponsors();
      await fetchMySponsorProfile(username);
    } catch (error) {
      setSponsorProfileMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSavingSponsorProfile(false);
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

  async function fetchArtistRequests(currentUsername: string) {
    try {
      setIsLoadingRequests(true);
      setRequestsError("");

      const response = await fetch(
        `/api/adittya/sponsorship-request/${encodeURIComponent(
          currentUsername
        )}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load artist requests.");
      }

      setArtistRequests(result.data || []);
    } catch (error) {
      setRequestsError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setArtistRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }

  async function fetchSponsorRequests(currentUsername: string) {
    try {
      setIsLoadingRequests(true);
      setRequestsError("");

      const response = await fetch(
        `/api/adittya/sponsor-requests/${encodeURIComponent(currentUsername)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load sponsor requests.");
      }

      setSponsorRequests(result.data || []);
    } catch (error) {
      setRequestsError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setSponsorRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }

  async function fetchAvailableArtistsForSponsor(currentUsername: string) {
    if (!currentUsername || !isSponsor) {
      setAvailableArtists([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/adittya/sponsor-artists/${encodeURIComponent(currentUsername)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load artists.");
      }

      setAvailableArtists(result.data || []);
    } catch (error) {
      console.error("Failed to load artists for sponsor:", error);
      setAvailableArtists([]);
    }
  }

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
          sponsor_username: selectedSponsor.sponsorUsername,
          sponsor_name: selectedSponsor.sponsorName,
          requested_amount: amountNumber,
          message: `Project Title: ${projectTitle}\nRequested Amount: ৳${amountNumber.toLocaleString()}\n\n${message}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send sponsorship request.");
      }

      await fetchArtistRequests(username);
      setRequestSent(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateSponsorOffer(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!username || !isSponsor) {
      setOfferError("Only sponsor users can create sponsorship offers.");
      return;
    }

    if (!selectedArtistUsername || !offerAmount || !offerMessage.trim()) {
      setOfferError("Artist, offer amount, and offer message are required.");
      return;
    }

    const numericAmount = Number(offerAmount);

    if (!numericAmount || numericAmount <= 0) {
      setOfferError("Offer amount must be greater than 0.");
      return;
    }

    try {
      setIsSendingOffer(true);
      setOfferError("");

      const response = await fetch("/api/adittya/sponsor-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sponsor_username: username,
          artist_username: selectedArtistUsername,
          offered_amount: numericAmount,
          message: `Sponsor Offer Amount: ৳${numericAmount.toLocaleString()}\n\n${offerMessage}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send sponsor offer.");
      }

      setSelectedArtistUsername("");
      setOfferAmount("");
      setOfferMessage("");

      await fetchSponsorRequests(username);
      alert("Sponsorship offer sent successfully.");
    } catch (error) {
      setOfferError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSendingOffer(false);
    }
  }

  async function updateRequestStatus(requestId: string, status: string) {
    if (!username || !isSponsor) {
      alert("Only sponsor users can update sponsorship request status.");
      return;
    }

    try {
      setStatusUpdatingId(requestId);

      const response = await fetch(
        `/api/adittya/sponsorship-request/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sponsor_username: username,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update request status.");
      }

      await fetchSponsorRequests(username);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setStatusUpdatingId("");
    }
  }

  async function respondToSponsorOffer(requestId: string, status: string) {
    if (!username || !isArtist) {
      alert("Only artist users can respond to sponsor offers.");
      return;
    }

    try {
      setStatusUpdatingId(requestId);

      const response = await fetch(
        `/api/adittya/sponsor-offer/${requestId}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artist_username: username,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to respond to sponsor offer.");
      }

      await fetchArtistRequests(username);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setStatusUpdatingId("");
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

  function statusBadge(status: string) {
    const normalized = String(status || "pending").toLowerCase();

    if (normalized === "approved" || normalized === "accepted") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "rejected") {
      return "bg-red-100 text-red-700";
    }

    if (normalized === "offered") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  function isPendingArtistRequest(request: SponsorshipRequest) {
    return String(request.status || "pending").toLowerCase() === "pending";
  }

  function isSponsorOffer(request: SponsorshipRequest) {
    return String(request.status || "").toLowerCase() === "offered";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Sponsor / Patron Listings
        </h1>

        <p className="mb-2 text-sm text-gray-600">
          Browse public sponsors and patrons for artist growth, events, and
          creative collaborations.
        </p>

        <p className="mb-4 text-sm text-gray-500">
          Artists can request sponsorship from public sponsors. Sponsors can
          publish their sponsor listing, manage requests, and start offers.
        </p>

        <div className="mb-8 rounded-2xl border bg-white px-5 py-4 text-sm text-gray-700 shadow-sm">
          {userLoading ? (
            <span>Checking signed-in user...</span>
          ) : username && isArtist ? (
            <span>
              Signed in as artist:{" "}
              <span className="font-semibold">{username}</span>
            </span>
          ) : username && isSponsor ? (
            <span>
              Signed in as sponsor:{" "}
              <span className="font-semibold">{username}</span>
            </span>
          ) : username ? (
            <span>
              Signed in as <span className="font-semibold">{username}</span>.
              This page requires artist or sponsor role for protected actions.
            </span>
          ) : (
            <span>Sign in as an artist or sponsor to use this feature.</span>
          )}
        </div>

        {isSponsor && (
          <div className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Sponsor Dashboard
            </h2>

            <p className="mb-6 text-sm text-gray-600">
              Create your public sponsor listing, start sponsorship offers, and
              manage requests sent to your sponsor account.
            </p>

            <div className="mb-8 rounded-2xl border bg-gray-50 p-5">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Create / Update Public Sponsor Listing
              </h3>

              <p className="mb-4 text-sm text-gray-600">
                This listing becomes visible to all artists when marked public.
              </p>

              <form
                onSubmit={handleSaveSponsorProfile}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <input
                  type="text"
                  value={sponsorProfileForm.sponsorName}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      sponsorName: e.target.value,
                    }))
                  }
                  placeholder="Sponsor name"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                />

                <input
                  type="text"
                  value={sponsorProfileForm.sponsorType}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      sponsorType: e.target.value,
                    }))
                  }
                  placeholder="Sponsor type"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                />

                <input
                  type="text"
                  value={sponsorProfileForm.city}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  placeholder="City"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                />

                <input
                  type="text"
                  value={sponsorProfileForm.focusAreas}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      focusAreas: e.target.value,
                    }))
                  }
                  placeholder="Focus areas, comma separated"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                />

                <input
                  type="number"
                  value={sponsorProfileForm.minBudget}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      minBudget: e.target.value,
                    }))
                  }
                  placeholder="Minimum budget"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                />

                <input
                  type="number"
                  value={sponsorProfileForm.maxBudget}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      maxBudget: e.target.value,
                    }))
                  }
                  placeholder="Maximum budget"
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                />

                <input
                  type="text"
                  value={sponsorProfileForm.preferredArtists}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      preferredArtists: e.target.value,
                    }))
                  }
                  placeholder="Preferred artist types, comma separated"
                  className="rounded-xl border px-4 py-2 text-sm outline-none md:col-span-2"
                />

                <textarea
                  value={sponsorProfileForm.description}
                  onChange={(e) =>
                    setSponsorProfileForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Sponsor description"
                  className="min-h-[100px] rounded-xl border px-4 py-3 text-sm outline-none md:col-span-2"
                  required
                />

                <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={sponsorProfileForm.isPublic}
                    onChange={(e) =>
                      setSponsorProfileForm((prev) => ({
                        ...prev,
                        isPublic: e.target.checked,
                      }))
                    }
                  />
                  Make this sponsor listing public for artists
                </label>

                {sponsorProfileMessage && (
                  <p className="text-sm text-gray-700 md:col-span-2">
                    {sponsorProfileMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingSponsorProfile}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60 md:w-fit"
                >
                  {savingSponsorProfile ? "Saving..." : "Save Sponsor Listing"}
                </button>
              </form>
            </div>

            <div className="mb-8 rounded-2xl border bg-gray-50 p-5">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Start Sponsorship Offer
              </h3>

              <p className="mb-4 text-sm text-gray-600">
                Choose an artist, review their profile, and send a sponsorship
                offer.
              </p>

              <form
                onSubmit={handleCreateSponsorOffer}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <select
                  value={selectedArtistUsername}
                  onChange={(e) => setSelectedArtistUsername(e.target.value)}
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                >
                  <option value="">Choose artist</option>
                  {availableArtists.map((artist) => (
                    <option key={artist.username} value={artist.username}>
                      {artist.name} (@{artist.username})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="rounded-xl border px-4 py-2 text-sm outline-none"
                  placeholder="Offer amount"
                  required
                />

                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="min-h-[100px] rounded-xl border px-4 py-3 text-sm outline-none md:col-span-2"
                  placeholder="Write your sponsorship offer message"
                  required
                />

                {selectedArtistUsername && (
                  <div className="md:col-span-2">
                    <Link
                      to={`/artists/${selectedArtistUsername}`}
                      className="text-sm text-blue-600 underline"
                    >
                      View selected artist profile
                    </Link>
                  </div>
                )}

                {offerError && (
                  <p className="text-sm text-red-600 md:col-span-2">
                    {offerError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSendingOffer}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60 md:w-fit"
                >
                  {isSendingOffer ? "Sending Offer..." : "Send Sponsorship Offer"}
                </button>
              </form>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Sponsor Request Management
              </h3>

              <p className="mb-5 text-sm text-gray-600">
                Review requests sent to your sponsor account.
              </p>

              {isLoadingRequests ? (
                <p className="text-sm text-gray-600">Loading requests...</p>
              ) : requestsError ? (
                <p className="text-sm text-red-600">{requestsError}</p>
              ) : sponsorRequests.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No sponsorship requests found for your sponsor account.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Artist
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Message
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Created
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sponsorRequests.map((request) => (
                        <tr key={request.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 text-sm text-gray-800">
                            <div className="font-semibold">
                              {request.artistName || request.artistUsername}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{request.artistUsername}
                            </div>
                            {request.artistUsername && (
                              <Link
                                to={`/artists/${request.artistUsername}`}
                                className="mt-1 inline-block text-xs text-blue-600 underline"
                              >
                                View Artist Profile
                              </Link>
                            )}
                          </td>

                          <td className="max-w-md whitespace-pre-line px-4 py-3 text-sm text-gray-800">
                            {request.message}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatAmount(request.requested_amount)}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(
                                request.status
                              )}`}
                            >
                              {request.status || "pending"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatDate(request.created_at)}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            {isPendingArtistRequest(request) ? (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    updateRequestStatus(request.id, "approved")
                                  }
                                  disabled={statusUpdatingId === request.id}
                                  className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    updateRequestStatus(request.id, "rejected")
                                  }
                                  disabled={statusUpdatingId === request.id}
                                  className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No sponsor action
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Public Sponsor Listings
        </h2>

        {sponsorsLoading ? (
          <p className="text-sm text-gray-600">Loading sponsors...</p>
        ) : sponsors.length === 0 ? (
          <p className="rounded-2xl border bg-white p-5 text-sm text-gray-600">
            No public sponsor listings are available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {sponsor.sponsorType || "Sponsor"}
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
                  <p className="text-sm text-gray-600">
                    {sponsor.budgetRange}
                  </p>
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
        )}

        {username && isArtist && (
          <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              My Sponsorship Requests / Offers
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              View your own sponsorship requests and sponsor offers sent to your
              artist account.
            </p>

            {isLoadingRequests ? (
              <p className="text-sm text-gray-600">Loading requests...</p>
            ) : requestsError ? (
              <p className="text-sm text-red-600">{requestsError}</p>
            ) : artistRequests.length === 0 ? (
              <p className="text-sm text-gray-600">
                No sponsorship requests or offers found for your artist account.
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
                        Amount
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
                    {artistRequests.map((request) => (
                      <tr key={request.id} className="border-b last:border-b-0">
                        <td className="whitespace-pre-line px-4 py-3 text-sm text-gray-800">
                          {request.message}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatAmount(request.requested_amount)}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(
                              request.status
                            )}`}
                          >
                            {request.status || "pending"}
                          </span>

                          {isSponsorOffer(request) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  respondToSponsorOffer(request.id, "accepted")
                                }
                                disabled={statusUpdatingId === request.id}
                                className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  respondToSponsorOffer(request.id, "rejected")
                                }
                                disabled={statusUpdatingId === request.id}
                                className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
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