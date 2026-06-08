export const PRODUCT_ORBIT_STAGES = [
  "problem",
  "research",
  "insights",
  "strategy",
  "wireframes",
  "design-system",
  "prototype",
  "testing",
  "launch"
] as const;

export type ProductOrbitStage = (typeof PRODUCT_ORBIT_STAGES)[number];

export type OrbitContribution = {
  stage: ProductOrbitStage;
  note: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  process: string;
  outcome: string;
  coverImage: string;
  gallery: string[];
  behanceUrl?: string;
  tags: string[];
  year?: string;
  client?: string;
  featured?: boolean;
  orbitContributions?: OrbitContribution[];
};
