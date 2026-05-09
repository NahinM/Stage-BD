import {
  supabase,
  makeError,
  checkUserArtistRoleAndProfile,
} from "./_utils.js";

export const listCampaigns = async () => {
  const { data: campaigns, error } = await supabase
    .from("campaign")
    .select(
      "id, artist_id, title, description, goal_amount, raised_amount, deadline, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  const artistIds = [
    ...new Set((campaigns || []).map((c) => c.artist_id).filter(Boolean)),
  ];

  let userMap = new Map();

  if (artistIds.length > 0) {
    const { data: users, error: userError } = await supabase
      .from("user")
      .select("id, username, firstname, lastname")
      .in("id", artistIds);

    if (userError) throw userError;

    userMap = new Map((users || []).map((u) => [u.id, u]));
  }

  return (campaigns || []).map((campaign) => {
    const artist = userMap.get(campaign.artist_id);
    const artistName =
      [artist?.firstname, artist?.lastname].filter(Boolean).join(" ").trim() ||
      artist?.username ||
      "Unknown Artist";

    return {
      id: campaign.id,
      artist_id: campaign.artist_id,
      artistName,
      title: campaign.title || "",
      description: campaign.description || "",
      goalAmount: Number(campaign.goal_amount || 0),
      raisedAmount: Number(campaign.raised_amount || 0),
      deadline: campaign.deadline,
      created_at: campaign.created_at,
    };
  });
};

export const createCampaignForArtistRecord = async ({
  username,
  requesting_username,
  title,
  description,
  goal_amount,
  deadline,
}) => {
  if (username.toLowerCase() !== requesting_username.toLowerCase()) {
    throw makeError("You can only create crowdfunding campaigns for yourself.", 403);
  }

  const status = await checkUserArtistRoleAndProfile(username);

  if (!status.user) throw makeError("User not found.", 404);

  if (!status.isArtist) {
    throw makeError("Only artist users can create crowdfunding campaigns.", 403);
  }

  if (!status.hasArtistProfile) {
    throw makeError(
      "You must create your artist portfolio before creating a crowdfunding campaign.",
      403
    );
  }

  const numericGoalAmount = Number(goal_amount);

  if (!numericGoalAmount || numericGoalAmount <= 0) {
    throw makeError("Goal amount must be greater than 0.", 400);
  }

  const { data, error } = await supabase
    .from("campaign")
    .insert([
      {
        artist_id: status.user.id,
        title,
        description,
        goal_amount: numericGoalAmount,
        raised_amount: 0,
        deadline,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const createContributionRecord = async ({
  campaign_id,
  supporter_username,
  amount,
}) => {
  const numericAmount = Number(amount);

  if (!campaign_id || !supporter_username || !numericAmount || numericAmount <= 0) {
    throw makeError(
      "campaign_id, supporter_username, and a valid amount are required.",
      400
    );
  }

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username")
    .eq("username", supporter_username)
    .maybeSingle();

  if (userError) throw userError;
  if (!user) throw makeError("Supporter user not found.", 404);

  const { data: campaign, error: campaignError } = await supabase
    .from("campaign")
    .select("id, raised_amount")
    .eq("id", campaign_id)
    .maybeSingle();

  if (campaignError) throw campaignError;
  if (!campaign) throw makeError("Campaign not found.", 404);

  const { data: contribution, error: contributionError } = await supabase
    .from("contribution")
    .insert([
      {
        campaign_id,
        user_id: user.id,
        amount: numericAmount,
      },
    ])
    .select()
    .single();

  if (contributionError) throw contributionError;

  const updatedRaisedAmount =
    Number(campaign.raised_amount || 0) + numericAmount;

  const { error: updateError } = await supabase
    .from("campaign")
    .update({ raised_amount: updatedRaisedAmount })
    .eq("id", campaign_id);

  if (updateError) throw updateError;

  return {
    contribution,
    updatedRaisedAmount,
  };
};