export type SponsorListing = {
  id: string;
  sponsorName: string;
  sponsorType: string;
  focusAreas: string[];
  city: string;
  budgetRange: string;
  description: string;
  preferredArtists: string[];
};

export const staticSponsorListings: SponsorListing[] = [
  {
    id: "sp-101",
    sponsorName: "Bangla Culture Foundation",
    sponsorType: "Cultural Sponsor",
    focusAreas: ["Music", "Classical Performance", "Cultural Events"],
    city: "Dhaka",
    budgetRange: "৳50,000 - ৳200,000",
    description:
      "Supports cultural preservation projects, live performances, and heritage-focused artist initiatives.",
    preferredArtists: ["Nazrul Sangeet Artist", "Classical Dancer", "Folk Musician"],
  },
  {
    id: "sp-102",
    sponsorName: "Creative Youth Media",
    sponsorType: "Digital Media Partner",
    focusAreas: ["Digital Art", "Online Content", "Youth Creators"],
    city: "Dhaka",
    budgetRange: "৳30,000 - ৳150,000",
    description:
      "Interested in creator-led visual campaigns, short-form digital content, and youth audience engagement.",
    preferredArtists: ["Digital Creator", "Illustrator", "Visual Storyteller"],
  },
  {
    id: "sp-103",
    sponsorName: "Rupali Events & Patron Circle",
    sponsorType: "Private Patron Group",
    focusAreas: ["Theatre", "Live Performance", "Art Exhibitions"],
    city: "Chattogram",
    budgetRange: "৳40,000 - ৳180,000",
    description:
      "Provides patron-style support for selected stage performers, exhibition artists, and curated live productions.",
    preferredArtists: ["Stage Performer", "Exhibition Artist", "Performance Visual Artist"],
  },
];