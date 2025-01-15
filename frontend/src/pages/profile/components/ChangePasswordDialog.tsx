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
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
    .object({
        oldPassword: z.string().min(8).max(250),
        newPassword: z.string().min(8).max(250),
        confirmNewPassword: z.string().min(8).max(250),
    })
    .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
        if (confirmNewPassword !== newPassword) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmNewPassword"],
            });
        }
    });

export default function ChangePasswordDialog() {
    const fetch = useFetch();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        fetch("user/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        }).then((res) => {
            if (res.status === 200) {
                toast({
                    title: "Changed password successfully",
                    description: `${res.body}`,
                });
                resetForm();
            } else if (res.status === 400) {
                toast({
                    title: "Changing password failed",
                    description: `${res.body}`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Changing password failed",
                    variant: "destructive",
                });
            }
        });
    }

    function resetForm() {
        form.reset({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
        setOpen(false);
    }

    function onError() {}
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={resetForm} className="bg-inherit">
                <a>Change your password</a>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change your password</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                        className="flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Old password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Your old password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="aVeryStrongPassword123!!"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Confirm new password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="aVeryStrongPassword123!!"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button type="submit">Change password</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
