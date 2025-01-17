import { z } from "zod";
import { TeacherTableRow } from "@/types/user-table-row";
import { orderOptionStrings, teachingStyleStrings } from "@/types/filter";
import {
    useRangeInput,
    useMultiSelect,
    useSelectInput,
} from "@/hooks/use-filter";
import Filter from "@/components/Filter";

const filterSchema = z
    .object({
        languages: z.array(z.string()).optional(),
        minYearsOfExperience: z.number().min(0).optional(),
        maxYearsOfExperience: z.number().min(0).optional(),
        teachingStyles: z
            .array(z.enum(teachingStyleStrings as [string, ...string[]]))
            .optional(),
        minHourlyRate: z.number().min(0).optional(),
        maxHourlyRate: z.number().min(0).optional(),
        // order: z.enum(orderOptionStrings as [string, ...string[]]),
        order: z.string(),
    })
    .superRefine(({ minYearsOfExperience, maxYearsOfExperience }, ctx) => {
        if (minYearsOfExperience && maxYearsOfExperience) {
            if (minYearsOfExperience > maxYearsOfExperience) {
                ctx.addIssue({
                    code: "custom",
                    message: "Min years of experience must be less than max",
                });
            }
        }
    })
    .superRefine(({ minHourlyRate, maxHourlyRate }, ctx) => {
        if (minHourlyRate && maxHourlyRate) {
            if (minHourlyRate > maxHourlyRate) {
                ctx.addIssue({
                    code: "custom",
                    message: "Min hourly rate must be less than max",
                });
            }
        }
    });

export default function TeacherFilteringForm({
    allLanguages,
    setTeachers,
}: {
    allLanguages: string[];
    setTeachers: React.Dispatch<React.SetStateAction<TeacherTableRow[]>>;
}) {
    const formFields: any[] = [
        useMultiSelect({
            options: allLanguages,
            name: "languages",
            label: "Languages",
            placeholder: "Select languages",
        }),
        useRangeInput({
            name: "YearsOfExperience",
            label: "Years of experience",
        }),
        useRangeInput({
            name: "HourlyRate",
            label: "Hourly rate",
        }),
        useMultiSelect({
            options: teachingStyleStrings,
            name: "teachingStyles",
            label: "Teaching Styles",
            placeholder: "Select teaching styles",
        }),
        useSelectInput({
            optionStrings: orderOptionStrings,
            name: "order",
            label: "Order",
            placeholder: "Select order",
            // defaultValue: "ALPHABETICAL_DESC",
        }),
    ];

    const toEnum = (str: string) => {
        return str.toUpperCase().replace(/ /g, "_") as string;
    };

    const filterToFetchParams = (data: any) => {
        return {
            languages: data.languages || [],
            minYearsOfExperience: data.minYearsOfExperience || 0,
            maxYearsOfExperience: data.maxYearsOfExperience || 100,
            teachingStyles: data.teachingStyles
                ? data.teachingStyles.map(toEnum)
                : teachingStyleStrings.map(toEnum),
            minHourlyRate: data.minHourlyRate || 0,
            maxHourlyRate: data.maxHourlyRate || 10000000,
            order: toEnum(data.order),
        };
    };

    return (
        <Filter
            filterFields={formFields}
            filterToFetch={filterToFetchParams}
            filterSchema={filterSchema}
            setTeachers={setTeachers}
        />
    );
}
