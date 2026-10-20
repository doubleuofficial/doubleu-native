// News / upcoming songs. Edit freely — no rebuild of the website needed.
export interface NewsItem {
  id: string;
  date: string;
  title: string;
  body: string;
  tag: "news" | "upcoming";
}

export const news: NewsItem[] = [
  {
    id: "app-launch",
    date: "2026-10-17",
    title: "The DoubleU app is live",
    body: "Radio, news, and shows — all in your pocket. No stories left behind.",
    tag: "news",
  },
  {
    id: "i-wanna-be-better",
    date: "2026-10-16",
    title: "I Wanna Be Better — master complete",
    body: "The new single is mastered and ready. Release date coming soon.",
    tag: "upcoming",
  },
  {
    id: "interrogation",
    date: "2026-10-01",
    title: "The Interrogation out now",
    body: "The latest single is streaming everywhere.",
    tag: "news",
  },
];
