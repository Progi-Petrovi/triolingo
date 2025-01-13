export type LanguageLevel = {
    language: string;
    level: KnowledgeLevel;
};

export enum KnowledgeLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
}

export function languageToKnowledgeMap(
    languageLevels: LanguageLevel[]
): Record<string, KnowledgeLevel> {
    return languageLevels.reduce((acc, curr) => {
        acc[curr.language] = curr.level;
        return acc;
    }, {} as Record<string, KnowledgeLevel>);
}

export function languageMapToArray(
    languageMap: Record<string, KnowledgeLevel>
): LanguageLevel[] {
    return Object.entries(languageMap).map(([language, level]) => ({
        language,
        level,
    }));
}
