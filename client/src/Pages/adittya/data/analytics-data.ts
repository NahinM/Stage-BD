export type OrganizerAnalyticsItem = {
  eventId: string;
  eventTitle: string;
  views: number;
  reservations: number;
  attendance: number;
  promoUses: number;
};

export const staticOrganizerAnalytics: OrganizerAnalyticsItem[] = [
  {
    eventId: "ev-101",
    eventTitle: "Pohela Boishakh Cultural Night",
    views: 240,
    reservations: 85,
    attendance: 71,
    promoUses: 14,
  },
  {
    eventId: "ev-102",
    eventTitle: "Nazrul Sangeet Evening",
    views: 180,
    reservations: 62,
    attendance: 55,
    promoUses: 9,
  },
  {
    eventId: "ev-103",
    eventTitle: "Digital Art and Performance Expo",
    views: 310,
    reservations: 124,
    attendance: 97,
    promoUses: 21,
  },
];