import { Review } from "@/components/Review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ReviewType } from "@/types/review";
import { Teacher as TeacherType } from "@/types/users";
import useUserContext from "@/context/use-user-context";

export default function TeacherReviews() {
    const { user, fetchUser } = useUserContext();
    const fetch = useFetch();
    const { id } = useParams();
    const [teacher, setTeacher] = useState<TeacherType>();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [sortedReviews, setSortedReviews] = useState<ReviewType[]>([]);
    const [averageRating, setAverageRating] = useState<number | string>("No reviews");

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    const setLastReviews = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) return;
        setSortedReviews(
            reviews.sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? 1 : -1))
        );
    };

    const setAvgRating = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) setAverageRating("No reviews");
        setAverageRating(
            (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        );
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

        fetch(`review/teacher/${id}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Reviews not found");
                    return;
                }
                setReviews(res.body as ReviewType[]);
                setLastReviews(res.body as ReviewType[]);
                setAvgRating(res.body as ReviewType[]);
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    }, [id]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    Reviews for{" "}
                    <Link to={`/teacher/${id}`} className="font-semibold">
                        {teacher?.fullName}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {reviews && reviews.length && (
                    <>
                        <div className="flex justify-between items-center gap-2">
                            <div className="font-bold text-xl">Average rating: {averageRating}</div>
                        </div>
                        <Card className="flex flex-col gap-4 p-2">
                            {sortedReviews.map((review) => (
                                <Review review={review} key={review.id} />
                            ))}
                        </Card>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
