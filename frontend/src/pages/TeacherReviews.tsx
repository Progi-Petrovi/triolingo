import { Review } from "@/components/Review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Review as ReviewType } from "@/types/review";
import { Student, Teacher as TeacherType } from "@/types/users";
import { useUser } from "@/context/use-user-context";

export default function TeacherReviews() {
    const fetch = useFetch();
    const { id } = useParams();
    const [teacher, setTeacher] = useState<TeacherType>();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [sortedReviews, setSortedReviews] = useState<ReviewType[]>([]);
    const [averageRating, setAverageRating] = useState<number | string>(
        "No rewiews"
    );

    const setLastReviews = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) return;
        setSortedReviews(
            reviews.sort((a, b) =>
                Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
            )
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

    useEffect(() => {
        fetch(`teacher/${id}`).then((res) => {
            setTeacher(res.body as TeacherType);
        });
        fetch(`review/teacher/${id}`).then((res) => {
            setReviews(res.body as ReviewType[]);
            setLastReviews(res.body as ReviewType[]);
            setAvgRating(res.body as ReviewType[]);
        });
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
                            <div className="font-bold text-xl">
                                Average rating: {averageRating}
                            </div>
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
