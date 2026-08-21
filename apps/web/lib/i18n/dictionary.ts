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
  articles: {
    eyebrow: string;
    title: string;
    readLink: string;
    allLink: string;
    pageDescription: string;
    allFilter: string;
    postsCount: (count: number) => string;
    sourceLabels: Record<ArticleSource, string>;
    backLink: string;
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
        blockchain: "Blockchain",
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
    articles: {
      eyebrow: "Writing",
      title: "Articles",
      readLink: "Read",
      allLink: "All articles",
      pageDescription: "Posts from this site and external write-ups, in one place.",
      allFilter: "All",
      postsCount: (count) => `${count} post${count === 1 ? "" : "s"}`,
      sourceLabels: {
        internal: "Blog",
        zenn: "Zenn",
        external: "External",
      },
      backLink: "All articles",
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
        blockchain: "ブロックチェーン",
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
    articles: {
      eyebrow: "Writing",
      title: "Articles",
      readLink: "読む",
      allLink: "記事一覧",
      pageDescription: "このサイトの記事と、外部に書いた記事をまとめています。",
      allFilter: "すべて",
      postsCount: (count) => `${count}件`,
      sourceLabels: {
        internal: "ブログ",
        zenn: "Zenn",
        external: "外部",
      },
      backLink: "記事一覧へ",
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
