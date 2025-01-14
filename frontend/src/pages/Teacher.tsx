import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role, Teacher as TeacherType } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { initials } from "@/utils/main";
import { Review } from "@/components/Review";
import AddReviewDialog from "@/components/AddReviewDialog";
import useUserContext from "@/context/use-user-context";
import { Review as ReviewType } from "@/types/review";

export default function Teacher() {
    /* TODO: remove */
    const DEV = true;

    const { user, fetchUser } = useUserContext();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const fetch = useFetch();
    const { id } = useParams();
    const [teacher, setTeacher] = useState<TeacherType>();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const maxReviews = 5;
    const [lastFewReviews, setLastFewReviews] = useState<ReviewType[]>([]);
    const [averageRating, setAverageRating] = useState<number | string>(
        "No rewiews"
    );
    const [canAddAReview, setCanAddAReview] = useState<boolean>(false);

    const setLastReviews = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) return;
        setLastFewReviews(
            reviews
                .sort((a, b) =>
                    Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
                )
                .slice(0, maxReviews)
        );
    };

    const setAvgRating = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) setAverageRating("No reviews");
        setAverageRating(
            (
                reviews.reduce((acc, review) => acc + review.rating, 0) /
                reviews.length
            ).toFixed(1)
        );
    };

    const setCanAdd = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) setCanAddAReview(true);
        setCanAddAReview(
            DEV ||
                reviews.every((review) => review.studentName !== user.fullName)
        );
    };

    const updateReviews = () => {
        fetch(`review/teacher/${id}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Reviews not found");
                    return;
                }
                setReviews(res.body as ReviewType[]);
                setLastReviews(res.body as ReviewType[]);
                setAvgRating(res.body as ReviewType[]);
                setCanAdd(res.body as ReviewType[]);
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    };

    useEffect(() => {
        fetch(`teacher/${id}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Teacher not found");
                    return;
                }
                setTeacher(res.body as TeacherType);
            })
            .catch((error) => console.error("Error fetching teacher:", error));
        updateReviews();
    }, [id]);

    if (!user || !teacher) {
        return <h1>Loading...</h1>;
    }

    if (user.role === Role.ROLE_TEACHER) {
        return <h1>Only students and admins can view teachers</h1>;
    }

    if (teacher === undefined) {
        return <div>Teacher not found</div>;
    }

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
                        <Button className="font-base">
                            See previous lessons
                        </Button>
                        <Button className="font-base">
                            <Link
                                to={`/teacher/lessons/${id}`}
                                className="text-inherit focus:text-inherit hover:text-inherit w-full h-full
                                    flex justify-center items-center text-base"
                            >
                                Book a lesson
                            </Link>
                        </Button>
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
                        {reviews && reviews.length > 0 ? (
                            <>
                                <div className="flex justify-between items-center gap-2">
                                    <div className="font-bold text-xl">
                                        Average rating: {averageRating}
                                    </div>
                                </div>
                                <Card className="flex flex-col gap-4 max-h-60 overflow-scroll p-2">
                                    {lastFewReviews.map((review) => (
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
                                    to={`/teacher/reviews/${id}`}
                                    className="text-inherit focus:text-inherit hover:text-inherit w-full h-full
                                    flex justify-center items-center text-base"
                                >
                                    See all reviews
                                </Link>
                            </Button>
                        )}

                        {canAddAReview && (
                            <AddReviewDialog
                                teacher={teacher.id}
                                updateReviews={updateReviews}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
