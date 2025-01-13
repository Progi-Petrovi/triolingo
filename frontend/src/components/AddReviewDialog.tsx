import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

const formSchema = z.object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(10).max(250),
});

import { ControllerRenderProps } from "react-hook-form";

function StarRating({
    field,
}: {
    field: ControllerRenderProps<any, "rating">;
}) {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`text-2xl bg-transparent
                                                        border-none hover:border-none focus:border-none
                                                        outline-none hover:outline-none focus:outline-none
                                                         ${
                                                             field.value >= star
                                                                 ? "text-yellow-500"
                                                                 : "text-gray-300"
                                                         }`}
                    onClick={() => field.onChange(star)}
                >
                    <Star fill="currentColor" />
                </button>
            ))}
        </div>
    );
}

export default function AddReviewDialog({
    teacherId,
    studentId,
}: {
    teacherId: number;
    studentId: number;
}) {
    const fetch = useFetch();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 1,
            content: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const review = {
            teacherId,
            studentId,
            ...values,
        };

        console.log(values);
        fetch("review/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review),
        }).then((res) => {
            if (res.status === 200) {
                toast({
                    title: "Review added successfully",
                    description: `${res.body}`,
                });
                resetForm();
            } else if (res.status === 400) {
                toast({
                    title: "Adding review failed",
                    description: `${res.body}`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Adding review failed",
                    variant: "destructive",
                });
            }
        });
    }

    function resetForm() {
        form.reset({
            rating: 1,
            content: "",
        });
        setOpen(false);
    }

    function onError() {}
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                onClick={resetForm}
                className="bg-primary hover:bg-primary"
            >
                Add a review
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a review</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                        className="flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <StarRating field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Comment</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button type="submit">Submit review</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
