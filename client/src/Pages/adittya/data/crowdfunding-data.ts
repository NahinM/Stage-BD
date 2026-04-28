export type CrowdfundingCampaign = {
  id: string;
  title: string;
  artistName: string;
  category: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
};

export const staticCrowdfundingCampaigns: CrowdfundingCampaign[] = [
  {
    id: "camp-101",
    title: "Debut Folk Album Production",
    artistName: "Munmun Ahmed",
    category: "Music",
    description:
      "Funding for studio recording, mixing, and promotional materials for a new folk album.",
    goalAmount: 120000,
    raisedAmount: 72000,
    deadline: "2026-05-20",
  },
  {
    id: "camp-102",
    title: "Nazrul Performance Tour Support",
    artistName: "Sujit Mustafa",
    category: "Performance",
    description:
      "Support for venue preparation, costume, and travel expenses for a cultural performance series.",
    goalAmount: 180000,
    raisedAmount: 126000,
    deadline: "2026-06-10",
  },
  {
    id: "camp-103",
    title: "Digital Art Exhibition Setup",
    artistName: "Salman Muqtadir",
    category: "Digital Art",
    description:
      "Funding for digital display setup, promotional design, and online showcase preparation.",
    goalAmount: 95000,
    raisedAmount: 41000,
    deadline: "2026-05-05",
  },
];