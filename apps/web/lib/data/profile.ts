import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Kyoya",
  handle: "KYO8",
  headline: {
    en: "KYO8\nBackend \nInfrastructure Engineer",
    ja: "KYO8\nバックエンド \nインフラエンジニア",
  },
  bio: {
    en: "Centering around Go, TypeScript, and AWS, I am deepening my understanding of underlying technologies that support systems, such as Linux, networking, and distributed systems.\n\nIn the long term, I aim to connect this knowledge with my experience in blockchain development to contribute to core protocol and infrastructure development for distributed systems, including Ethereum.",
    ja: "Go / TypeScript、AWSを軸に、Linuxやネットワーク、分散システムなど、システムを支える基盤技術への理解を深めています。\n\n長期的には、これらの知識とブロックチェーン開発の経験をつなげ、Ethereumをはじめとする分散システムの基盤開発に携わることを目指しています。",
  },
  location: {
    en: "Tokyo",
    ja: "東京",
  },
  focus: ["Go", "AWS", "Blockchain", "Low-level Systems"],
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/",
  xUrl: "https://x.com/",
  email: "mailto:hello@kyo8.dev",
};
