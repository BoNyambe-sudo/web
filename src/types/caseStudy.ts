export interface TechStackItem {
  name: string;
  color: string;
  icon: string;
}

export interface CaseStudyFeature {
  title: string;
  items: string[];
}

export interface CaseStudyChallenge {
  title: string;
  solution: string;
}

export interface CaseStudyResult {
  metric: string;
  target: string;
}

export interface CaseStudyLinks {
  live: string;
  github: string;
}

export interface CaseStudyDeployment {
  frontend: string;
  backend?: string;
  database: string;
  ci: string;
  cms?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  badge: string;
  techStack: TechStackItem[];
  links: CaseStudyLinks;
  overview: string;
  architecture: string;
  keyDecisions: string[];
  features: CaseStudyFeature[];
  projectStructure?: string;
  challenges: CaseStudyChallenge[];
  results?: CaseStudyResult[];
  performance?: string[];
  futureEnhancements: string[];
  deployment: CaseStudyDeployment;
}