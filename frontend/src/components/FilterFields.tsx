import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import MultipleSelector, { Option } from "./ui/multi-select";
import { useState } from "react";

export function FilterField({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex flex-col justify-end items-end">
            <div className="flex flex-row justify-center items-center gap-2">
                {children}
            </div>
        </div>
    );
}

export function RangeInput({
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
}): any {
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

export function SelectInput({
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
    defaultValue?: string;
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
                                defaultValue={defaultValue || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValueHandler(value);
                                }}
                                value={valueHandler || defaultValue}
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

export function MultiSelectInput({
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

export function useRangeInput(props: { name: string; label: string }) {
    const [minValueHandler, setMinValueHandler] = useState(0);
    const [maxValueHandler, setMaxValueHandler] = useState(0);

    return (form: any) => {
        return [
            () => (
                <RangeInput
                    form={form}
                    name={props.name}
                    label={props.label}
                    minValueHandler={minValueHandler}
                    setMinValueHandler={setMinValueHandler}
                    maxValueHandler={maxValueHandler}
                    setMaxValueHandler={setMaxValueHandler}
                />
            ),
            [() => setMinValueHandler(0), () => setMaxValueHandler(0)],
        ];
    };
}
