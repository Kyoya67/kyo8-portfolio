export type SkillCategory =
  | "languages"
  | "backend"
  | "infrastructure"
  | "database"
  | "blockchain"
  | "tools";

export type CareerType = "work" | "internship" | "education";

export interface Profile {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  location: string;
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
  summary: string;
  description: string;
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
}

export interface Career {
  id: string;
  type: CareerType;
  organization: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  note: string;
  order: number;
}
