import type { Career } from "@/types";

export const careers: Career[] = [
  {
    id: "mock-warning",
    type: "work",
    organization: "⚠ MOCK DATA (API unreachable)",
    position: { en: "Placeholder", ja: "プレースホルダー" },
    startDate: "2000-01",
    endDate: null,
    description: { en: "This is placeholder content.", ja: "これはプレースホルダーです。" },
    note: "",
    order: 999,
  },
  {
    id: "c01",
    type: "work",
    organization: "Mercoin (Mercari)",
    position: {
      en: "Backend Engineer Intern",
      ja: "バックエンドエンジニア インターン",
    },
    startDate: "2025-03",
    endDate: null,
    description: {
      en: "Working on the development of an NFT marketplace.",
      ja: "NFTマーケットプレイスの開発に従事。",
    },
    note: "push value",
    order: 1,
  },
  {
    id: "c02",
    type: "internship",
    organization: "GMO Pepabo (SUZURI)",
    position: {
      en: "Backend Engineer Intern",
      ja: "バックエンドエンジニア インターン",
    },
    startDate: "2024-07",
    endDate: "2024-08",
    description: {
      en: "Worked on API development for an online service.",
      ja: "オンラインサービスのAPI開発を担当。",
    },
    note: "call",
    order: 2,
  },
  {
    id: "c03",
    type: "education",
    organization: "IAMAS (Media Art)",
    position: {
      en: "M1 + M2 (withdrawal)",
      ja: "M1・M2（中途退学）",
    },
    startDate: "2024-04",
    endDate: "2025-03",
    description: {
      en: "Research on media expression and technology.",
      ja: "メディア表現とテクノロジーの研究。",
    },
    note: "continue",
    order: 3,
  },
  {
    id: "c04",
    type: "education",
    organization: "The University of Aizu",
    position: {
      en: "B.Sc. in Computer Engineering",
      ja: "コンピュータ工学 学士",
    },
    startDate: "2021-04",
    endDate: "2025-03",
    description: {
      en: "Studied distributed systems and formal methods.",
      ja: "分散システム・形式手法を中心に学習。",
    },
    note: "return",
    order: 4,
  },
];
