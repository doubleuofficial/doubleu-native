// The Vault — app-exclusive content. Unreleased snippets, demos, BTS.
// Change UNLOCK_CODE and share it on socials to let fans in.
export const UNLOCK_CODE = "NOSTORIES";

export interface VaultItem {
  id: string;
  title: string;
  kind: "snippet" | "demo" | "bts" | "note";
  description: string;
  audioUrl?: string;
}

export const vaultItems: VaultItem[] = [
  {
    id: "v1",
    title: "Studio snippet — untitled",
    kind: "snippet",
    description: "Raw cut from the last session. Not mixed, not mastered — just real.",
  },
  {
    id: "v2",
    title: "Voice memo: song idea",
    kind: "demo",
    description: "Where it starts. One mic, one take.",
  },
  {
    id: "v3",
    title: "From DoubleU",
    kind: "note",
    description: "Thanks for being here early. More coming — you heard it here first.",
  },
];

export const kindLabel: Record<VaultItem["kind"], string> = {
  snippet: "SNIPPET",
  demo: "DEMO",
  bts: "BEHIND THE SCENES",
  note: "NOTE",
};

export const kindEmoji: Record<VaultItem["kind"], string> = {
  snippet: "🎙️",
  demo: "🎧",
  bts: "🎬",
  note: "✉️",
};
