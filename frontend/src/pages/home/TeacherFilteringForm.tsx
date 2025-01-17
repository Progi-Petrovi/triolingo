import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/use-fetch";
import { TeacherTableRow } from "@/types/user-table-row";
import {
    FilterFields,
    orderOptionStrings,
    teachingStyleStrings,
} from "@/types/filter";
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
    const fetch = useFetch();

    const onSubmit = async (data: z.infer<typeof filterSchema>) => {
        console.log("Submitted filter form with data: ", data);

        const filterParams = {
            languages: data.languages || allLanguages,
            minYearsOfExperience: data.minYearsOfExperience || 0,
            maxYearsOfExperience: data.maxYearsOfExperience || 100,
            teachingStyles: data.teachingStyles || teachingStyleStrings,
            minHourlyRate: data.minHourlyRate || 0,
            maxHourlyRate: data.maxHourlyRate || 10000000,
            order: data.order,
        };

        console.log("Filtering with params: ", filterParams);
        const queryParams = new URLSearchParams(filterParams as any).toString();
        const res = await fetch(`/teacher/filter?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Filtered teachers: ", res.body);

        setTeachers(res.body as TeacherTableRow[]);
        resetForm();
    };

    const form = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            order: "ALPHABETICAL_DESC",
        },
    });

    function resetForm() {
        form.reset();
    }

    const teacherFilterFields = [
        {
            field: FilterFields.MULTISELECT,
            props: {
                name: "languages",
                label: "Languages",
                placeholder: "Select languages",
                options: allLanguages,
            },
        },
        {
            field: FilterFields.RANGE,
            props: { name: "YearsOfExperience", label: "Years of experience" },
        },
        {
            field: FilterFields.RANGE,
            props: { name: "HourlyRate", label: "Hourly rate" },
        },
        {
            field: FilterFields.MULTISELECT,
            props: {
                name: "teachingStyles",
                label: "Teaching Styles",
                placeholder: "Select teaching styles",
                options: teachingStyleStrings,
            },
        },
        {
            field: FilterFields.SELECT,
            props: {
                name: "order",
                label: "Order",
                placeholder: "Select order",
                optionStrings: orderOptionStrings,
                defaultValue: "ALPHABETICAL_DESC",
            },
        },
    ];

    return (
        <Filter
            form={form}
            filterFields={teacherFilterFields}
            onSubmit={onSubmit}
        />
    );
}
