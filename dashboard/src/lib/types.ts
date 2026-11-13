export interface Skill {
  id: string;
  name: string;
  module: string;
  folder: string;
  path: string;
  description: string;
  tags: string[];
  score: number;
  bytes: number;
  words: number;
  headings: string[];
  excerpt: string;
}

export interface ModuleRow {
  id: string;
  name: string;
  tagline: string;
  category: string;
  hue: number;
  origin: string;
  skills: number;
  docs: number;
  scripts: number;
  assets: number;
  files: number;
  bytes: number;
  quality: number;
  features: string[];
}

export interface Feature {
  name: string;
  count: number;
  modules: number;
}

export interface Category {
  name: string;
  modules: number;
  skills: number;
}

export interface Library {
  generatedAt: string;
  meta: {
    modules: number;
    skills: number;
    features: number;
    files: number;
    bytes: number;
    docs: number;
    scripts: number;
    assets: number;
    words: number;
    averageQuality: number;
    branch: string;
    baseCommit: string;
  };
  modules: ModuleRow[];
  skills: Skill[];
  features: Feature[];
  bands: { excellent: number; strong: number; fair: number; thin: number };
  weekly: { week: string; skills: number; commits: number; total: number }[];
  categories: Category[];
}

export type Priority = "now" | "next" | "later" | "done";

export interface BoardCard {
  id: string;
  title: string;
  detail: string;
  tag: string;
  priority: Priority;
  linkedSkill?: string;
  createdAt: number;
}

export type ViewId =
  | "overview"
  | "library"
  | "skills"
  | "features"
  | "board"
  | "quality"
  | "settings";
