import { enumToStringList, optionsMapToSelectValuesMap } from "@/utils/main";

enum OrderOptions {
    ALPHABETICAL_ASC = "ALPHABETICAL_ASC",
    ALPHABETICAL_DESC = "ALPHABETICAL_DESC",
    YEARS_OF_EXPERIENCE_ASC = "YEARS_OF_EXPERIENCE_ASC",
    YEARS_OF_EXPERIENCE_DESC = "YEARS_OF_EXPERIENCE_DESC",
    HOURLY_RATE_ASC = "HOURLY_RATE_ASC",
    HOURLY_RATE_DESC = "HOURLY_RATE_DESC",
}

enum TeachingStyle {
    INDIVIDUAL = "Individual",
    FLEXIBLE = "Flexible",
    GROUP = "Group",
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

const orderOptionsMap = {
    [OrderOptions.ALPHABETICAL_DESC]: "Abc \u2193",
    [OrderOptions.ALPHABETICAL_ASC]: "Abc \u2191",
    [OrderOptions.YEARS_OF_EXPERIENCE_DESC]: "Experience \u2193",
    [OrderOptions.YEARS_OF_EXPERIENCE_ASC]: "Experience \u2191",
    [OrderOptions.HOURLY_RATE_DESC]: "Rate \u2193",
    [OrderOptions.HOURLY_RATE_ASC]: "Rate \u2191",
};

const orderOptionsValueMap = optionsMapToSelectValuesMap(OrderOptions, orderOptionsMap);

const selectValueMap = {
    ...orderOptionsValueMap
}

export const selectValueMapper = (value: string | undefined) => {
    if (!value) {
        return "";
    }

    if (selectValueMap.hasOwnProperty(value)) {
        return selectValueMap[value];
    }

    return value;
}