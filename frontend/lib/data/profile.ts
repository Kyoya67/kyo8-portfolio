import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Kyoya",
  handle: "KYO8",
  headline: {
    en: "Backend / Infrastructure Engineer",
    ja: "バックエンド / インフラエンジニア",
  },
  bio: {
    en: "I design and build scalable backend systems, infrastructure, and developer tooling. Focused on low-level insights and long-term value.",
    ja: "スケールするバックエンドシステム、インフラ、開発者向けツールを設計・構築しています。低レイヤーの理解と長期的な価値を大切にしています。",
  },
  location: {
    en: "Tokyo, Japan",
    ja: "東京, 日本",
  },
  focus: ["Go", "AWS", "Blockchain", "Low-level Systems"],
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/",
  xUrl: "https://x.com/",
  email: "mailto:hello@kyo8.dev",
};
