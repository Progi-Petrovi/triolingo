import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { TeacherTableRow } from "@/types/user-table-row";
import { orderOptionStrings, teachingStyleStrings } from "@/types/filter";
import { useState } from "react";
import { max } from "date-fns/fp/max";

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

function RangeInput({
    form,
    name,
    label,
    minValueHandler,
    setMinValueHandler,
    maxValueHandler,
    setMaxValueHandler,
}: {
    form: any;
    name: string;
    label: string;
    minValueHandler: number;
    setMinValueHandler: React.Dispatch<React.SetStateAction<number>>;
    maxValueHandler: number;
    setMaxValueHandler: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <>
            <FormLabel>{label}:</FormLabel>
            <div className="max-w-[80px]">
                <FormField
                    control={form.control}
                    name={`min${name}`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Min"
                                    value={minValueHandler || ""}
                                    onChange={(e) => {
                                        field.onChange(
                                            Number(e.target.value) || 0
                                        );
                                        setMinValueHandler(
                                            Number(e.target.value) || 0
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <span>-</span>
            <div className="max-w-[80px]">
                <FormField
                    control={form.control}
                    name={`max${name}`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Max"
                                    value={maxValueHandler || ""}
                                    onChange={(e) => {
                                        field.onChange(
                                            Number(e.target.value) || 0
                                        );
                                        setMaxValueHandler(
                                            Number(e.target.value) || 0
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}

function MultiSelectInput({
    form,
    options,
    name,
    label,
    placeholder,
    valueHandler,
    setValueHandler,
}: {
    form: any;
    options: Option[];
    name: string;
    label: string;
    placeholder: string;
    valueHandler: string[];
    setValueHandler: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    return (
        <>
            <FormLabel>{label}:</FormLabel>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <MultipleSelector
                        hidePlaceholderWhenSelected
                        options={options}
                        value={
                            valueHandler.map((value: string) => ({
                                label: value,
                                value: value,
                            })) as Option[]
                        }
                        onChange={(value) => {
                            field.onChange(value.map((option) => option.value));
                            setValueHandler(
                                value.map((option) => option.value)
                            );
                        }}
                        placeholder={placeholder}
                    />
                )}
            />
        </>
    );
}

function SelectInput({
    form,
    optionStrings: options,
    name,
    label,
    placeholder,
    defaultValue,
    valueHandler,
    setValueHandler: setValueHandler,
}: {
    form: any;
    optionStrings: string[];
    name: string;
    label: string;
    placeholder: string;
    defaultValue: string;
    valueHandler: string;
    setValueHandler: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <>
            <FormLabel>{label}:</FormLabel>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Select
                                defaultValue={defaultValue}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValueHandler(value);
                                }}
                                value={valueHandler}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

function FilterField({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex flex-col justify-end items-end">
            <div className="flex flex-row justify-center items-center gap-2">
                {children}
            </div>
        </div>
    );
}

export default function TeacherFilteringForm({
    allLanguages,
    setTeachers,
}: {
    allLanguages: string[];
    setTeachers: React.Dispatch<React.SetStateAction<TeacherTableRow[]>>;
}) {
    const fetch = useFetch();

    function optionsToMultiSelectOptions(options: string[]): Option[] {
        return options.map((option) => ({
            label: option,
            value: option,
        }));
    }

    const TEACHINGSTYLES = optionsToMultiSelectOptions(teachingStyleStrings);
    const LANGUAGES: Option[] = optionsToMultiSelectOptions(allLanguages);

    const [languagesHandler, setLanguagesHandler] = useState<string[]>([]);
    const [minYearsOfExperienceHandler, setMinYearsOfExperienceHandler] =
        useState(0);
    const [maxYearsOfExperienceHandler, setMaxYearsOfExperienceHandler] =
        useState(0);
    const [minHourlyRateHandler, setMinHourlyRateHandler] = useState(0);
    const [maxHourlyRateHandler, setMaxHourlyRateHandler] = useState(0);
    const [teachingStylesHandler, setTeachingStylesHandler] = useState<
        string[]
    >([]);
    const [orderingHandler, setOrderingHandler] = useState("");

    const onSubmit = async (data: z.infer<typeof filterSchema>) => {
        console.log("Submitted filter form with data: ", data);

        const toEnum = (str: string) => {
            return str.toUpperCase().replace(/ /g, "_") as string;
        };

        const filterParams = {
            languages: data.languages || allLanguages,
            minYearsOfExperience: data.minYearsOfExperience || 0,
            maxYearsOfExperience: data.maxYearsOfExperience || 100,
            teachingStyles: data.teachingStyles
                ? data.teachingStyles.map(toEnum)
                : teachingStyleStrings.map(toEnum),
            minHourlyRate: data.minHourlyRate || 0,
            maxHourlyRate: data.maxHourlyRate || 10000000,
            order: toEnum(data.order),
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
        setLanguagesHandler([]);
        setMinYearsOfExperienceHandler(0);
        setMaxYearsOfExperienceHandler(0);
        setMinHourlyRateHandler(0);
        setMaxHourlyRateHandler(0);
        setTeachingStylesHandler([]);
        setOrderingHandler("");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
                <div className="flex flex-row flex-wrap gap-4">
                    {/* Languages Filter */}
                    <FilterField>
                        <MultiSelectInput
                            form={form}
                            options={LANGUAGES}
                            name="languages"
                            label="Languages"
                            placeholder="Select languages"
                            valueHandler={languagesHandler}
                            setValueHandler={setLanguagesHandler}
                        />
                    </FilterField>

                    {/* Years of Experience Filters */}
                    <FilterField>
                        <RangeInput
                            form={form}
                            name="YearsOfExperience"
                            label="Years of experience"
                            minValueHandler={minYearsOfExperienceHandler}
                            setMinValueHandler={setMinYearsOfExperienceHandler}
                            maxValueHandler={maxYearsOfExperienceHandler}
                            setMaxValueHandler={setMaxYearsOfExperienceHandler}
                        />
                    </FilterField>

                    {/* Hourly Rate Filters */}
                    <FilterField>
                        <RangeInput
                            form={form}
                            name="HourlyRate"
                            label="Hourly rate"
                            minValueHandler={minHourlyRateHandler}
                            setMinValueHandler={setMinHourlyRateHandler}
                            maxValueHandler={maxHourlyRateHandler}
                            setMaxValueHandler={setMaxHourlyRateHandler}
                        />
                    </FilterField>

                    {/* Teaching Style Filter */}
                    <FilterField>
                        <MultiSelectInput
                            form={form}
                            options={TEACHINGSTYLES}
                            name="teachingStyles"
                            label="Teaching Styles"
                            placeholder="Select teaching styles"
                            valueHandler={teachingStylesHandler}
                            setValueHandler={setTeachingStylesHandler}
                        />
                    </FilterField>

                    {/* Order Filter */}
                    <FilterField>
                        <SelectInput
                            form={form}
                            optionStrings={orderOptionStrings}
                            name="order"
                            label="Order"
                            placeholder="Select order"
                            defaultValue={"ALPHABETICAL_DESC"}
                            valueHandler={orderingHandler}
                            setValueHandler={setOrderingHandler}
                        />
                    </FilterField>

                    <div className="flex justify-end items-end">
                        <Button type="submit" className="">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
