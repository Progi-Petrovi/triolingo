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
import { FilterFields } from "@/types/filter";

type RangeInputProps = {
    form: any;
    name: string;
    label: string;
};

function RangeInput({ form, name, label }: RangeInputProps) {
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
                                    value={field.value == 0 ? "" : field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            Number(e.target.value) || 0
                                        )
                                    }
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
                                    value={field.value == 0 ? "" : field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            Number(e.target.value) || 0
                                        )
                                    }
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

function optionsToMultiSelectOptions(options: string[]): Option[] {
    return options.map((option) => ({
        label: option,
        value: option,
    }));
}

type MultiSelectInputProps = {
    form: any;
    options: string[];
    name: string;
    label: string;
    placeholder: string;
};

function MultiSelectInput({
    form,
    options,
    name,
    label,
    placeholder,
}: MultiSelectInputProps) {
    const optionsList = optionsToMultiSelectOptions(options);

    return (
        <>
            <FormLabel>{label}:</FormLabel>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <MultipleSelector
                        hidePlaceholderWhenSelected
                        options={optionsList}
                        onChange={(value) => {
                            field.onChange(value.map((option) => option.value));
                        }}
                        placeholder={placeholder}
                    />
                )}
            />
        </>
    );
}

type SelectInputProps = {
    form: any;
    optionStrings: string[];
    name: string;
    label: string;
    placeholder: string;
    defaultValue?: string;
};

function SelectInput({
    form,
    optionStrings: options,
    name,
    label,
    placeholder,
    defaultValue,
}: SelectInputProps) {
    console.log(form, options, name, label, placeholder, defaultValue);

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
                                defaultValue={defaultValue ?? options[0]}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                }}
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

export default function Filter({
    form,
    filterFields,
    onSubmit,
}: {
    form: any;
    filterFields: {
        field: FilterFields;
        props: any;
    }[];
    onSubmit: any;
}) {
    return (
        <Form {...form}>
            <Button onClick={() => console.log("Print form", form.getValues())}>
                Print form
            </Button>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
                <div className="flex flex-row flex-wrap gap-4">
                    <div className="flex justify-end items-end">
                        {filterFields.map(({ field, props }) => (
                            <FilterField key={props.name}>
                                {field === FilterFields.MULTISELECT ? (
                                    <MultiSelectInput
                                        {...({
                                            ...props,
                                            form,
                                        } as MultiSelectInputProps)}
                                    />
                                ) : field === FilterFields.RANGE ? (
                                    <RangeInput
                                        {...({
                                            ...props,
                                            form,
                                        } as RangeInputProps)}
                                    />
                                ) : field === FilterFields.SELECT ? (
                                    <SelectInput
                                        {...({
                                            ...props,
                                            form,
                                        } as SelectInputProps)}
                                    />
                                ) : null}
                            </FilterField>
                        ))}
                        <Button type="submit" className="">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
