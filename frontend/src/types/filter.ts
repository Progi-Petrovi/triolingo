import { enumToStringList } from "@/utils/main";

enum OrderOptions {
    ALPHABETICAL_DESC = "ALPHABETICAL_DESC",
    ALPHABETICAL_ASC = "ALPHABETICAL_ASC",
    YEARS_OF_EXPERIENCE_DESC = "YEARS_OF_EXPERIENCE_DESC",
    YEARS_OF_EXPERIENCE_ASC = "YEARS_OF_EXPERIENCE_ASC",
    HOURLY_RATE_DESC = "HOURLY_RATE_DESC",
    HOURLY_RATE_ASC = "HOURLY_RATE_ASC",
}


enum TeachingStyle {
    INDIVIDUAL = "INDIVIDUAL",
    FLEXIBLE = "FLEXIBLE",
    GROUP = "GROUP",
}

export const orderOptionStrings = enumToStringList(OrderOptions);
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