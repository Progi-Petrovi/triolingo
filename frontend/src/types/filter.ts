import { enumToStringList } from "@/utils/main";

enum SortOptions {
    ALPHABETICAL_ASC = "Abc \u2191", 
    ALPHABETICAL_DESC = "Abc \u2193",
    YEARS_OF_EXPERIENCE_ASC = "Experience \u2191",
    YEARS_OF_EXPERIENCE_DESC = "Experience \u2193",
    HOURLY_RATE_ASC = "Rate \u2191",
    HOURLY_RATE_DESC = "Rate \u2193",
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