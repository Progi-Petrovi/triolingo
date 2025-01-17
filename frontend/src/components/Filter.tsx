import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FilterField } from "./FilterFields";

export default function Filter({
    filterSchema,
    filterFields,
    filterToFetch: filterToFetchParams,
    setTeachers,
}: {
    filterSchema: any;
    filterFields: ((form: any) => [() => JSX.Element, (() => void)[]])[];
    filterToFetch: (arg: any) => void;
    setTeachers: (arg: any) => void;
}) {
    const fetch = useFetch();

    const form = useForm<z.infer<typeof filterSchema>>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            order: "ALPHABETICAL_DESC",
        },
    });

    let elementCreators: (() => JSX.Element)[] = [];
    let resetFields: (() => void)[] = [];

    for (let i = 0; i < filterFields.length; i++) {
        const [elementCreator, resetField] = filterFields[i](form);
        elementCreators.push(elementCreator);
        resetFields = resetFields.concat(resetField);
    }

    const onSubmit = async (data: z.infer<typeof filterSchema>) => {
        console.log("Submitted filter form with data: ", data);

        const filterParams = filterToFetchParams(data);

        console.log("Filtering with params: ", filterParams);
        const queryParams = new URLSearchParams(filterParams as any).toString();
        const res = await fetch(`/teacher/filter?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Filtered teachers: ", res.body);

        setTeachers(res.body);
        resetForm();
    };

    function resetForm() {
        form.reset();
        console.log("Resetting form");
        console.log("Resetting fields: ", resetFields);
        resetFields.forEach((resetField) => {
            resetField();
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
                <div className="flex flex-row flex-wrap gap-4">
                    {elementCreators.map((elementCreator, i) => (
                        <FilterField key={i}>{elementCreator()}</FilterField>
                    ))}

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
