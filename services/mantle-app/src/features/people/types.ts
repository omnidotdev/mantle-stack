export interface Person {
  id: string;
  name: string;
  emails: string[];
  tags: string[];
  notes: string;
  internal: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonFormData {
  name: string;
  emails: string[];
  tags: string[];
  notes: string;
  internal: boolean;
}

export const COMMON_TAGS = [
  "employee",
  "client",
  "prospect",
  "active",
  "inactive",
  "design",
  "engineering",
  "research",
  "leadership",
  "contractor",
] as const;

export type CommonTag = (typeof COMMON_TAGS)[number];
