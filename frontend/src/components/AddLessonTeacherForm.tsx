import { Button } from "@/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/select";
import useUserContext from "@/context/use-user-context";
import { Teacher as TeacherType } from "@/types/users";
import { DateTimePicker } from "./DateTimePicker";

const formSchema = z
    .object({
        startInstant: z.date(),
        endInstant: z.date(),
        language: z.string().min(2, "Language is required"),
    })
    .superRefine(({ startInstant, endInstant }, ctx) => {
        if (startInstant > endInstant) {
            ctx.addIssue({
                code: "custom",
                message: "Start time must be before end time",
            });
        }
        if (startInstant < new Date()) {
            ctx.addIssue({
                code: "custom",
                message: "Start time must be in the future",
                path: ["startInstant"],
            });
        }
        if (endInstant < new Date()) {
            ctx.addIssue({
                code: "custom",
                message: "End time must be in the future",
                path: ["endInstant"],
            });
        }
    });

export default function AddLessonTeacherForm({
    onSuccess,
}: {
    onSuccess: () => void;
}) {
    const { toast } = useToast();
    const fetch = useFetch();
    const teacher = useUserContext().user as TeacherType;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startInstant: new Date(),
            endInstant: new Date(),
            language: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const req = {
            startInstant: values.startInstant.toISOString(),
            endInstant: values.endInstant.toISOString(),
            language: values.language,
        };
        console.log("Request: ", req);
        try {
            const response = await fetch("/lesson", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req),
            });

            console.log("Response: ", response);

            if (response.status === 201) {
                toast({ title: "Lesson created successfully!" });
                onSuccess();
                resetForm();
            } else {
                toast({
                    title: "Failed to create lesson",
                    description: await response.body(),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({ title: "An error occurred", variant: "destructive" });
        }
    }

    function resetForm() {
        form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="startInstant"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endInstant"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teacher.languages.map((language) => (
                                            <SelectItem
                                                key={language}
                                                value={language}
                                            >
                                                {language}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit Lesson Opening</Button>
            </form>
        </Form>
    );
}
