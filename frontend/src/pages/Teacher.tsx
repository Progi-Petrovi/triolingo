import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student, Teacher as TeacherType } from "@/types/users";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { initials } from "@/utils/main";
import { Review } from "@/components/Review";
import moment from "moment";
import AddReviewDialog from "@/components/AddReviewDialog";
import { useUser } from "@/context/use-user-context";

type Review = {
    id: string;
    teacherId: string;
    user: string;
    rating: number;
    comment: string;
    date: Date;
};

export default function Teacher() {
    const user = useUser() as Student;

    const fetch = useFetch();
    const { id } = useParams();
    const [teacher, setTeacher] = useState<TeacherType>();
    const reviews: Review[] = [
        {
            id: "1",
            teacherId: "1",
            user: "John Doe",
            rating: 5,
            comment: "Great teacher, very patient and knowledgeable.",
            date: moment().subtract(1, "day").toDate(),
        },
        {
            id: "2",
            teacherId: "1",
            user: "Jane Doe",
            rating: 4,
            comment: "Good teacher, but could be more patient.",
            date: moment().subtract(2, "days").toDate(),
        },
    ];
    // const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch(`teacher/${id}`).then((res) => {
            setTeacher(res.body as TeacherType);
        });
        // TODO: Uncomment this when the endpoint is ready
        // fetch(`teacher/reviews/${id}`).then((res) => {
        //     setReviews(res.body as Review[]);
        // });
    }, [fetch, id]);

    if (!teacher) {
        return <div>Loading...</div>;
    }

    let canAddAReview = false;
    let avgRating = NaN;
    let lastFewReviews: Review[] = [];
    const maxRatings = 5;

    if (reviews && reviews.length) {
        canAddAReview = reviews.every(
            (review) => review.user !== user.fullName
        );
        avgRating =
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length;
        lastFewReviews = reviews.slice(0, maxRatings);
    }

    const averageRating = isNaN(avgRating)
        ? "No reviews"
        : avgRating.toFixed(1);

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage src="/*TODO*/:get_from_backend" />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(teacher.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {teacher.fullName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>Teacher</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Hourly Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.hourlyRate ? "€" + teacher.hourlyRate : "free"}
                    </CardContent>
                </Card>
                <Card className="max-h-50 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 flex-wrap">
                        {teacher.languages.length
                            ? teacher.languages.map((lang) => (
                                  <Badge key={lang}>{lang}</Badge>
                              ))
                            : "No languages"}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Lessons</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button>See previous lessons</Button>
                        <Button>Book a lesson</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 justify-center w-full md:w-96">
                <Card>
                    <CardHeader>
                        <CardTitle>Years of experience</CardTitle>
                    </CardHeader>
                    <CardContent>{teacher.yearsOfExperience}</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>{teacher.teachingStyle}</CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.qualifications || "No qualifications"}
                    </CardContent>
                </Card>
                <Card className="md:w-96">
                    <CardHeader>
                        <CardTitle>Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-center gap-2">
                            <div className="font-bold text-xl">
                                Average rating: {averageRating}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {lastFewReviews.map((review) => (
                                <Review review={review} />
                            ))}
                        </div>

                        {reviews && reviews.length > maxRatings && (
                            <Button>See all reviews</Button>
                        )}

                        {canAddAReview && (
                            <AddReviewDialog
                                teacherId={teacher.id}
                                studentId={user.id}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
