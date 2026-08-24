import type { ArticleSource, CareerType, SkillCategory } from "@/types";

interface DictionaryShape {
  hero: {
    systemOnline: string;
    viewWork: string;
    scroll: string;
    basedIn: (location: string) => string;
  };
  about: {
    title: string;
    infoLabel: string;
    nameLabel: string;
    roleLabel: string;
    locationLabel: string;
    focusLabel: string;
    statusLabel: string;
    statusValue: string;
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
    pageTitle: string;
    overview: string;
    technologies: string;
    links: string;
    repository: string;
    website: string;
  };
  articles: {
    eyebrow: string;
    title: string;
    readLink: string;
    sourceLabels: Record<ArticleSource, string>;
  };
  career: {
    eyebrow: string;
    title: string;
    allLink: string;
    pageDescription: string;
    types: Record<CareerType, string>;
    now: string;
  };
  cta: {
    title: [string, string, string];
    prompt: string;
    button: string;
  };
}

export const dictionary: Record<"en" | "ja", DictionaryShape> = {
  en: {
    hero: {
      systemOnline: "System online",
      viewWork: "View my work",
      scroll: "Scroll",
      basedIn: (location: string) => `based in ${location}.`,
    },
    about: {
      title: "About",
      infoLabel: "INFO",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "open to interesting problems",
    },
    skills: {
      eyebrow: "Stack",
      title: "Skills",
      allLink: "All skills",
      pageDescription: "Tools and technologies I reach for, grouped by where they sit in the stack.",
      categories: {
        frontend: "Frontend",
        backend: "Backend",
        infrastructure: "Infrastructure",
        database: "Database",
        authentication: "Authentication & Authorization",
        blockchain: "Blockchain",
      },
    },
    projects: {
      eyebrow: "Work",
      title: "Selected Projects",
      pageTitle: "Projects",
      overview: "Overview",
      technologies: "Technologies",
      links: "Links",
      repository: "Repository",
      website: "Website",
    },
    articles: {
      eyebrow: "Writing",
      title: "Articles",
      readLink: "Read",
      sourceLabels: {
        internal: "Blog",
        zenn: "Zenn",
        external: "External",
      },
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
    cta: {
      title: ["Let's", "build something", "great."],
      prompt: "Have a project in mind? Let's connect.",
      button: "Get in touch",
    },
  },
  ja: {
    hero: {
      systemOnline: "システム稼働中",
      viewWork: "作品を見る",
      scroll: "スクロール",
      basedIn: (location: string) => `${location}在住。`,
    },
    about: {
      title: "About",
      infoLabel: "INFO",
      nameLabel: "name",
      roleLabel: "role",
      locationLabel: "location",
      focusLabel: "focus",
      statusLabel: "status",
      statusValue: "面白い課題を募集中",
    },
    skills: {
      eyebrow: "Stack",
      title: "Skills",
      allLink: "すべてのスキルを見る",
      pageDescription: "スタックの中でそれぞれが担う役割ごとに整理した、普段使用している技術一覧です。",
      categories: {
        frontend: "フロントエンド",
        backend: "バックエンド",
        infrastructure: "インフラ",
        database: "データベース",
        authentication: "認証・認可",
        blockchain: "ブロックチェーン",
      },
    },
    projects: {
      eyebrow: "Work",
      title: "Selected Projects",
      pageTitle: "Projects",
      overview: "概要",
      technologies: "使用技術",
      links: "リンク",
      repository: "リポジトリ",
      website: "ウェブサイト",
    },
    articles: {
      eyebrow: "Writing",
      title: "Articles",
      readLink: "読む",
      sourceLabels: {
        internal: "ブログ",
        zenn: "Zenn",
        external: "外部",
      },
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
    cta: {
      title: ["一緒に", "何かすごいものを", "作りましょう。"],
      prompt: "プロジェクトのご相談はお気軽にどうぞ。",
      button: "連絡する",
    },
  },
};

export type Dictionary = typeof dictionary;
