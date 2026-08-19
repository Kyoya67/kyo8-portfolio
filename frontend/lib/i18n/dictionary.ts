import type { CareerType, SkillCategory } from "@/types";

interface DictionaryShape {
  about: {
    eyebrow: string;
    title: string;
    basedIn: (headline: string, location: string) => string;
    moreLink: string;
    whoami: string;
    nameLabel: string;
    roleLabel: string;
    locationLabel: string;
    focusLabel: string;
    statusLabel: string;
    statusValue: string;
    pageDescription: string;
  };
  skills: {
    eyebrow: string;
    title: string;
    allLink: string;
    pageDescription: string;
    categories: Record<SkillCategory, string>;
  };
  projects: {
    eyebrow: string;
    title: string;
    allLink: string;
    pageEyebrow: string;
    pageTitle: string;
    pageDescription: string;
    allProjectsLink: string;
    overview: string;
    technologies: string;
    links: string;
    repository: string;
    website: string;
  };
  career: {
    eyebrow: string;
    title: string;
    allLink: string;
    pageDescription: string;
    types: Record<CareerType, string>;
    now: string;
  };
}

export const dictionary: Record<"en" | "ja", DictionaryShape> = {
  en: {
    about: {
      eyebrow: "Profile",
      title: "About",
      basedIn: (headline: string, location: string) => `${headline} based in ${location}.`,
      moreLink: "More about me",
      whoami: "whoami",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "open to interesting problems",
      pageDescription: "Backend / Infrastructure Engineer",
    },
    skills: {
      eyebrow: "Stack",
      title: "Skills",
      allLink: "All skills",
      pageDescription: "Tools and technologies I reach for, grouped by where they sit in the stack.",
      categories: {
        languages: "Languages",
        backend: "Backend",
        infrastructure: "Infrastructure",
        database: "Database",
        blockchain: "Blockchain",
        tools: "Tools",
      },
    },
    projects: {
      eyebrow: "Work",
      title: "Selected Projects",
      allLink: "View all projects",
      pageEyebrow: "Work",
      pageTitle: "Projects",
      pageDescription: "A selection of systems and tools I've designed and built end to end.",
      allProjectsLink: "All projects",
      overview: "Overview",
      technologies: "Technologies",
      links: "Links",
      repository: "Repository",
      website: "Website",
    },
    career: {
      eyebrow: "Journey",
      title: "Career",
      allLink: "Full timeline",
      pageDescription: "Work, internships, and education — in chronological order.",
      types: {
        work: "Work",
        internship: "Internship",
        education: "Education",
      },
      now: "Now",
    },
  },
  ja: {
    about: {
      eyebrow: "プロフィール",
      title: "About",
      basedIn: (headline: string, location: string) => `${location}在住の${headline}。`,
      moreLink: "詳しいプロフィール",
      whoami: "whoami",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "面白い課題を募集中",
      pageDescription: "バックエンド / インフラエンジニア",
    },
    skills: {
      eyebrow: "Stack",
      title: "Skills",
      allLink: "すべてのスキルを見る",
      pageDescription: "スタックの中でそれぞれが担う役割ごとに整理した、普段使用している技術一覧です。",
      categories: {
        languages: "言語",
        backend: "バックエンド",
        infrastructure: "インフラ",
        database: "データベース",
        blockchain: "ブロックチェーン",
        tools: "ツール",
      },
    },
    projects: {
      eyebrow: "Work",
      title: "Selected Projects",
      allLink: "すべてのプロジェクトを見る",
      pageEyebrow: "Work",
      pageTitle: "Projects",
      pageDescription: "設計から実装まで一貫して手がけたシステムやツールの一覧です。",
      allProjectsLink: "プロジェクト一覧へ",
      overview: "概要",
      technologies: "使用技術",
      links: "リンク",
      repository: "リポジトリ",
      website: "ウェブサイト",
    },
    career: {
      eyebrow: "Journey",
      title: "Career",
      allLink: "経歴をすべて見る",
      pageDescription: "職歴・インターン・学歴を時系列で掲載しています。",
      types: {
        work: "Work",
        internship: "Internship",
        education: "Education",
      },
      now: "現在",
    },
  },
};

export type Dictionary = typeof dictionary;
