import { z } from "zod";
import { TeacherTableRow } from "@/types/user-table-row";
import { orderOptionStrings, teachingStyleStrings } from "@/types/filter";
import Filter from "@/components/Filter";
import { toEnum } from "@/utils/main";
import { FilterField } from "@/types/filter";

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
        order: z.enum(orderOptionStrings as [string, ...string[]]),
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
    const filterFields = [
        {
            type: FilterField.MULTI_SELECT,
            name: "languages",
            label: "Languages",
            options: allLanguages,
            placeholder: "Select languages",
        },
        {
            type: FilterField.RANGE,
            name: "YearsOfExperience",
            label: "Years of experience",
        },
        {
            type: FilterField.RANGE,
            name: "HourlyRate",
            label: "Hourly rate",
        },
        {
            type: FilterField.MULTI_SELECT,
            name: "teachingStyles",
            label: "Teaching Styles",
            options: teachingStyleStrings,
            placeholder: "Select teaching styles",
        },
        {
            type: FilterField.SELECT,
            name: "order",
            label: "Sort by",
            options: orderOptionStrings,
            placeholder: "Select sort",
        },
    ];

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
            filterSchema={filterSchema}
            filterFields={filterFields}
            filterToFetch={filterToFetchParams}
            setTeachers={setTeachers}
        />
    );
}
