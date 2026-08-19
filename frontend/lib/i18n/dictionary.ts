import type { CareerType, SkillCategory } from "@/types";

interface DictionaryShape {
  nav: {
    about: string;
    skills: string;
    projects: string;
    career: string;
  };
  hero: {
    heading1: string;
    heading2: string;
  };
  about: {
    eyebrow: string;
    title: string;
    basedIn: (headline: string, location: string) => string;
    lead: string;
    moreLink: string;
    resumeLink: string;
    whoami: string;
    nameLabel: string;
    roleLabel: string;
    locationLabel: string;
    focusLabel: string;
    statusLabel: string;
    statusValue: string;
    pageDescription: string;
    paragraphs: [
      (name: string, headline: string, location: string, bio: string) => string,
      string,
      string,
    ];
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
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      career: "Career",
    },
    hero: {
      heading1: "Building systems.",
      heading2: "Solving problems.",
    },
    about: {
      eyebrow: "Profile",
      title: "About",
      basedIn: (headline: string, location: string) => `${headline} based in ${location}.`,
      lead: "I enjoy building systems that scale and solving complex problems with elegant design.",
      moreLink: "More about me",
      resumeLink: "Resume (PDF)",
      whoami: "whoami",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "open to interesting problems",
      pageDescription: "Backend / Infrastructure Engineer",
      paragraphs: [
        (name: string, headline: string, location: string, bio: string) =>
          `I'm ${name}, a ${headline.toLowerCase()} based in ${location}. ${bio}`,
        "I care about the layers most people don't see — request routing, data modeling, deployment pipelines, and the infrastructure that keeps a system honest under load. Good architecture is invisible when it works and obvious when it doesn't; I try to build the former.",
        "Outside of backend work I spend time exploring blockchain infrastructure and media-driven technology, treating each project as a chance to understand a system from the protocol up.",
      ],
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
    nav: {
      about: "プロフィール",
      skills: "スキル",
      projects: "プロジェクト",
      career: "経歴",
    },
    hero: {
      heading1: "システムを構築する。",
      heading2: "課題を解決する。",
    },
    about: {
      eyebrow: "プロフィール",
      title: "About",
      basedIn: (headline: string, location: string) => `${location}を拠点に活動する${headline}。`,
      lead: "スケールするシステムを作ること、そして複雑な問題をエレガントな設計で解決することにやりがいを感じています。",
      moreLink: "詳しいプロフィール",
      resumeLink: "レジュメ (PDF)",
      whoami: "whoami",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "面白い課題を募集中",
      pageDescription: "バックエンド / インフラエンジニア",
      paragraphs: [
        (name: string, headline: string, location: string, bio: string) =>
          `${location}を拠点に活動する${headline}、${name}です。${bio}`,
        "リクエストのルーティング、データモデリング、デプロイパイプライン、そして負荷がかかっても嘘をつかないインフラなど、多くの人が目にしない部分にこだわっています。優れたアーキテクチャは、うまく機能しているときは見えず、機能していないときにだけ目に見える。私はいつも前者を目指しています。",
        "バックエンド以外では、ブロックチェーンインフラやメディアテクノロジーの探求に時間を使っています。どのプロジェクトも、プロトコルレベルからシステムを理解するための機会だと捉えています。",
      ],
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
