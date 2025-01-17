import { enumToStringList } from "@/utils/main";

enum SortOptions {
    ALPHABETICAL_ASC = "ABC \u2191", // A-Z
    ALPHABETICAL_DESC = "ABC \u2193", // Z-A
    YEARS_OF_EXPERIENCE_ASC = "Experience \u2191", // Low to High
    YEARS_OF_EXPERIENCE_DESC = "Experience \u2193", // High to Low
    HOURLY_RATE_ASC = "Rate \u2191", // Low to High
    HOURLY_RATE_DESC = "Rate \u2193", // High to Low
}

enum TeachingStyle {
    INDIVIDUAL = "Individual",
    FLEXIBLE = "Flexible",
    GROUP = "Group",
}

export const sortOptionStrings = enumToStringList(SortOptions);
export const teachingStyleStrings = enumToStringList(TeachingStyle);

export enum FilterField {
    SELECT,
    MULTI_SELECT,
    RANGE,
}

export type FilterFieldType = {
    type: FilterField;
    name: string;
    label: string;
    options?: string[];
    placeholder?: string;
};