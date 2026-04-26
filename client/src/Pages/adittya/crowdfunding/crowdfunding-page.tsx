import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  artist_id: string;
  artistName: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  created_at: string;
};

export default function CrowdfundingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [supporterUsername, setSupporterUsername] = useState("test_supporter");
  const [amount, setAmount] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contributionSuccess, setContributionSuccess] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch("/api/adittya/campaigns");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load campaigns.");
      }

      setCampaigns(result.data || []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateString: string) {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  function openContributionModal(campaign: Campaign) {
    setSelectedCampaign(campaign);
    setSupporterUsername("test_supporter");
    setAmount("");
    setSubmitError("");
    setContributionSuccess(false);
  }

  function closeContributionModal() {
    setSelectedCampaign(null);
    setAmount("");
    setSubmitError("");
    setContributionSuccess(false);
    setIsSubmitting(false);
  }

  async function handleContributionSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedCampaign) return;

    if (!supporterUsername || !amount) {
      setSubmitError("Supporter username and amount are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/adittya/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: selectedCampaign.id,
          supporter_username: supporterUsername,
          amount: Number(amount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save contribution.");
      }

      setContributionSuccess(true);
      await fetchCampaigns();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Crowdfunding for Art Projects
        </h1>
        <p className="mb-8 text-sm text-gray-600">
          Support artist-led projects by browsing active fundraising campaigns.
        </p>

        {isLoading ? (
          <p className="text-sm text-gray-600">Loading campaigns...</p>
        ) : loadError ? (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              No crowdfunding campaigns found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => {
              const progress =
                campaign.goalAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campaign.raisedAmount / campaign.goalAmount) * 100
                      )
                    )
                  : 0;

              return (
                <div
                  key={campaign.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Active Campaign
                    </span>
                    <span className="text-xs text-gray-500">
                      Deadline: {formatDate(campaign.deadline)}
                    </span>
                  </div>

                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {campaign.title}
                  </h2>

                  <p className="mb-2 text-sm text-gray-600">
                    by {campaign.artistName}
                  </p>

                  <p className="mb-4 text-sm leading-6 text-gray-700">
                    {campaign.description}
                  </p>

                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">
                      ৳{campaign.raisedAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      of ৳{campaign.goalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mb-4 text-sm text-gray-600">{progress}% funded</p>

                  <button
                    onClick={() => openContributionModal(campaign)}
                    className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Support This Project
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            {!contributionSuccess ? (
              <>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Support This Project
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                  Contribute to{" "}
                  <span className="font-semibold">{selectedCampaign.title}</span>.
                </p>

                <form onSubmit={handleContributionSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Supporter Username
                    </label>
                    <input
                      type="text"
                      value={supporterUsername}
                      onChange={(e) => setSupporterUsername(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                      placeholder="Enter supporter username"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800">
                      Contribution Amount (৳)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeContributionModal}
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
                      {isSubmitting ? "Saving..." : "Confirm Support"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Contribution Saved
                </h2>
                <p className="mb-4 text-sm text-gray-700">
                  Your contribution has been recorded for{" "}
                  <span className="font-semibold">{selectedCampaign.title}</span>.
                </p>
                <p className="mb-6 text-sm text-gray-600">
                  The contribution has been stored and the campaign amount has been updated.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={closeContributionModal}
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