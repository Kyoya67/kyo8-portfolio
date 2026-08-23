export type Locale = "en" | "ja";

export type LocalizedText = Record<Locale, string>;

export type SkillCategory =
  | "frontend"
  | "backend"
  | "infrastructure"
  | "database"
  | "blockchain";

export type CareerType = "work" | "internship" | "education";

export interface Profile {
  name: string;
  handle: string;
  headline: LocalizedText;
  bio: LocalizedText;
  location: LocalizedText;
  focus: string[];
  githubUrl: string;
  linkedinUrl?: string | null;
  xUrl?: string | null;
  email?: string | null;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: LocalizedText;
  description: LocalizedText;
  graphic: "analytics" | "network" | "terminal" | "chain" | "grid" | "stream";
  repositoryUrl: string;
  websiteUrl?: string | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  order: number;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  order: number;
  keywords: string[];
}

export interface Career {
  id: string;
  type: CareerType;
  organization: string;
  position: LocalizedText;
  startDate: string;
  endDate: string | null;
  description: LocalizedText;
  note: string;
  order: number;
}

export type ArticleSource = "internal" | "zenn" | "external";

export interface Article {
  id: string;
  slug: string | null;
  title: LocalizedText;
  summary: LocalizedText;
  body?: LocalizedText;
  url: string;
  source: ArticleSource;
  sourceLabel: string;
  publishedAt: string;
  published: boolean;
  order: number;
}
