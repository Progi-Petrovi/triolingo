import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachingStyle } from "@/types/teaching-style";
import { ProfileProps } from "@/types/profile";
import { Role, Student } from "@/types/users";
import ProfileLayout from "./components/ProfileLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TeachingStyleFormField from "../common/TeachingStyleFormField";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import RenderFormButtons from "./components/RenderFormButtons";

const studentSchema = z.object({
    teachingStyle: z.nativeEnum(TeachingStyle),
    learningGoals: z.string().optional(),
    fullName: z.string().min(2).max(250),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentProfile({
    userProfile,
    role,
    profileOwner,
}: ProfileProps) {
    const student = userProfile as Student;

    const fetch = useFetch();
    const { toast } = useToast();
    const [editMode, setEditMode] = useState<boolean>(false);

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            fullName: student.fullName,
            teachingStyle: student.preferredTeachingStyle,
            learningGoals: student.learningGoals,
        },
    });

    async function onSubmit(data: StudentFormValues) {
        const fetchLink = role === Role.ROLE_ADMIN ? `${student.id}` : "";
        fetch(`student/${fetchLink}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                preferredTeachingStyle: data.teachingStyle,
            }),
        }).then((res) => {
            if (res.status === 200) {
                window.location.reload();
            } else
                toast({
                    title: "Updating student failed",
                    description: `${res.status === 400 ? res.body : ""}`,
                    variant: "destructive",
                });
        });

        setEditMode(false);
    }

    function StudentRight() {
        return (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Preferred teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editMode ? (
                            <TeachingStyleFormField form={form} />
                        ) : (
                            student.preferredTeachingStyle
                        )}
                    </CardContent>
                </Card>
                <Card className="md:w-96 w-80 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editMode ? (
                            <FormField
                                control={form.control}
                                name="learningGoals"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            student.learningGoals || "No learning goals."
                        )}
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <ProfileLayout
                    userProfile={userProfile}
                    profileOwner={profileOwner}
                    role={role}
                    form={form}
                    editMode={editMode}
                    toggleEditMode={() => setEditMode(!editMode)}
                >
                    <StudentRight />
                </ProfileLayout>
                {editMode && (
                    <RenderFormButtons
                        toggleEditMode={() => setEditMode(!editMode)}
                    />
                )}
            </form>
        </Form>
    );
}
