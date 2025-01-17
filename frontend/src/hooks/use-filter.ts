import { useState } from "react";
import { RangeInput, MultiSelectInput, SelectInput} from "@/components/FilterFields";

export function useRangeInput(props: { name: string; label: string }) {
    const [minValueHandler, setMinValueHandler] = useState(0);
    const [maxValueHandler, setMaxValueHandler] = useState(0);

    return (form: any) => {
        return [
            () => {
                return RangeInput({
                    form: form,
                    name: props.name,
                    label: props.label,
                    minValueHandler,
                    setMinValueHandler,
                    maxValueHandler,
                    setMaxValueHandler,
                });
            }, 
            [() => setMinValueHandler(0), () => setMaxValueHandler(0)]
        ];
    };
}
export function useMultiSelect(props: {
    options: string[];
    name: string;
    label: string;
    placeholder: string;
}) {
    const [valueHandler, setValueHandler] = useState<string[]>([]);

    const multiSelectOptions = props.options.map((option) => ({
        label: option,
        value: option,
    }));

    return (form: any) => {
        return [
            () => {
                return MultiSelectInput({
                    form: form,
                    options: multiSelectOptions,
                    name: props.name,
                    label: props.label,
                    placeholder: props.placeholder,
                    valueHandler,
                    setValueHandler,
                });
            },
            [() => setValueHandler([])],
        ];
    };
}

export function useSelectInput(props: {
    optionStrings: string[];
    name: string;
    label: string;
    placeholder: string;
    defaultValue?: string;
}){
    if (!props.defaultValue) {
        props.defaultValue = "";
    }

    const [valueHandler, setValueHandler] = useState<string>(props.defaultValue);

    return (form: any) => {
        return [
            () => {
                return SelectInput({
                    form: form,
                    optionStrings: props.optionStrings,
                    name: props.name,
                    label: props.label,
                    placeholder: props.placeholder,
                    defaultValue: props.defaultValue,
                    valueHandler,
                    setValueHandler,
                });                
            },
            [() => setValueHandler("")],
        ];
    };
}
