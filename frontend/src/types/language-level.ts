export type LanguageLevel = {
  language: string;
  level: KnowledgeLevel;
};

export enum KnowledgeLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}
