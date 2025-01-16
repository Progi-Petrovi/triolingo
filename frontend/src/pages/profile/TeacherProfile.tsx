import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachingStyle } from "@/types/teaching-style";
import { Button } from "@/components/ui/button";
import { Role, Teacher } from "@/types/users";
import AddReviewDialog from "@/components/AddReviewDialog";
import { Review } from "@/components/Review";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useReviews } from "@/hooks/use-reviews";
import ProfileLayout from "./components/ProfileLayout";
import { ProfileProps } from "@/types/profile";
import { z } from "zod";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import RenderFormButtons from "./components/RenderFormButtons";
import { Input } from "@/components/ui/input";
import TeachingStyleFormField from "../common/TeachingStyleFormField";
import { Textarea } from "@/components/ui/textarea";

const teacherSchema = z.object({
    teachingStyle: z.nativeEnum(TeachingStyle),
    qualifications: z.string().optional(),
    fullName: z.string().min(2).max(250),
    yearsOfExperience: z.coerce.number().min(0).max(100),
    hourlyRate: z.coerce.number().min(0).max(100000),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export default function TeacherProfile({
    userProfile,
    role,
    profileOwner,
}: ProfileProps) {
    const teacher = userProfile as Teacher;

    const maxReviews = 5;
    const [{ reviews, latestRewiews, averageRating }, updateReviews] =
        useReviews(maxReviews, teacher.id);

    const fetch = useFetch();
    const { toast } = useToast();
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        updateReviews();
        console.log("TeacherProfile role:", role);
    }, []);

    const form = useForm<TeacherFormValues>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            fullName: teacher.fullName,
            teachingStyle: teacher.teachingStyle,
            qualifications: teacher.qualifications,
            yearsOfExperience: teacher.yearsOfExperience,
            hourlyRate: teacher.hourlyRate,
        },
    });

    async function onSubmit(data: TeacherFormValues) {
        const fetchLink = role === Role.ROLE_ADMIN ? `${teacher.id}` : "";
        fetch(`teacher/${fetchLink}`, {
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
                    title: "Updating teacher failed",
                    description: `${res.status === 400 ? res.body : ""}`,
                    variant: "destructive",
                });
        });

        setEditMode(false);
    }

    function TeacherRight() {
        return (
            <>
                <Card className="md:w-96 p-3">
                    <CardHeader>
                        <CardTitle>Years of experience</CardTitle>
                    </CardHeader>
                    {editMode ? (
                        <FormField
                            control={form.control}
                            name="yearsOfExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <CardContent>{teacher.yearsOfExperience}</CardContent>
                    )}
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editMode ? (
                            <TeachingStyleFormField form={form} />
                        ) : (
                            teacher.teachingStyle
                        )}
                    </CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editMode ? (
                            <FormField
                                control={form.control}
                                name="qualifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : teacher.qualifications ? (
                            teacher.qualifications
                        ) : (
                            "No qualifications."
                        )}
                    </CardContent>
                </Card>
                {role !== Role.ROLE_TEACHER && (
                    <Card className="md:w-96">
                        <CardHeader>
                            <CardTitle>Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {reviews && reviews.length > 0 ? (
                                <>
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="font-bold text-xl">
                                            Average rating: {averageRating}
                                        </div>
                                    </div>
                                    <Card className="flex flex-col gap-4 max-h-60 overflow-scroll p-2">
                                        {latestRewiews.map((review) => (
                                            <Review
                                                review={review}
                                                key={review.id}
                                            />
                                        ))}
                                    </Card>
                                </>
                            ) : (
                                <div>No reviews</div>
                            )}
                            {reviews.length > maxReviews && (
                                <Button className="p-0 flex justify-center items-center">
                                    <Link
                                        to={`/teacher/reviews/${userProfile.id}`}
                                        className="text-inherit focus:text-inherit hover:text-inherit w-full h-full
                                            flex justify-center items-center text-base"
                                    >
                                        See all reviews
                                    </Link>
                                </Button>
                            )}

                            {role && (
                                <AddReviewDialog
                                    teacher={teacher.id}
                                    updateReviews={updateReviews}
                                />
                            )}
                        </CardContent>
                    </Card>
                )}
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
                    <TeacherRight />
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
