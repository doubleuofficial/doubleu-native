// Upcoming shows. Add real dates here — the app sorts by distance automatically.
export interface Show {
  id: string;
  venue: string;
  city: string;
  date: string;
  lat: number;
  lng: number;
  ticketUrl?: string;
  note?: string;
}

export const shows: Show[] = [
  // Example — replace with real shows:
  // {
  //   id: "okc-1",
  //   venue: "Tower Theatre",
  //   city: "Oklahoma City, OK",
  //   date: "2026-12-12",
  //   lat: 35.4742,
  //   lng: -97.5178,
  //   ticketUrl: "https://example.com/tickets",
  //   note: "With special guests",
  // },
];
