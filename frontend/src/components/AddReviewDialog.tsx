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
import { Review as ReviewType } from "@/types/review";

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
        <div className="flex items-center justify-around">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`lg:text-3xl bg-transparent md:text-2xl text-lg p-0
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

export function submitReview(
    review: {
        teacherId: number;
        studentId: number;
        rating: number;
        content: string;
    },
    toast: ReturnType<typeof useToast>["toast"],
    resetForm: ReturnType<typeof useForm>["reset"],
    updateReviews: () => void
) {
    const fetch = useFetch();

    fetch("review/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
    }).then(async (res) => {
        if (res.status === 403) {
            toast({
                title: "Session expired. Please log in again.",
                variant: "destructive",
            });
            window.location.reload();
            console.warn("Session expired. Please log in again.");
            return;
        }
        const responseBody = await res.body;
        console.log(responseBody);
        if (res.status === 200) {
            toast({
                title: "Review added successfully",
                description: `${responseBody.content}`,
            });
            updateReviews();
            resetForm();
        } else {
            toast({
                title: "Adding review failed",
                description: `${responseBody}`,
                variant: "destructive",
            });
        }
    });
}

export default function AddReviewDialog({
    teacherId,
    studentId,
    updateReviews,
}: {
    teacherId: number;
    studentId: number;
    updateReviews: () => void;
}) {
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

        submitReview(review, toast, resetForm, updateReviews);
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
            <DialogContent className="md:max-w-[90vw] max-w-[95vw]">
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
                                        <Textarea
                                            {...field}
                                            // className="w-[90%]"
                                        />
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
