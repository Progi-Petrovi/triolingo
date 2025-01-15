import { ReviewType } from "@/types/review";
import { useState } from "react";
import { useFetch } from "./use-fetch";

function useLatestReviews(maxReviews: number) {
    const [lastFewReviews, setLastFewReviews] = useState<ReviewType[]>([]);

    const setLastMaxReviews = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) return;
        setLastFewReviews(
            reviews
                .sort((a, b) =>
                    Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
                )
                .slice(0, maxReviews)
        );
    };

    return [lastFewReviews, setLastMaxReviews] as const;
}

function useAverageRating() {
    const [averageRating, setAverageRating] = useState<number>(0);

    const setAvgRating = (reviews: ReviewType[]) => {
        if (!reviews || !reviews.length) setAverageRating(0);
        setAverageRating(
            Number(
                (
                    reviews.reduce((acc, review) => acc + review.rating, 0) /
                    reviews.length
                ).toFixed(1)
            )
        );
    };

    return [averageRating, setAvgRating] as const;
}

export function useReviews(maxReviews: number, teacherId: number) {
    const fetch = useFetch();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [latestRewiews, setLatestReviews] = useLatestReviews(maxReviews);
    const [averageRating, setAverageRating] = useAverageRating();

    const updateReviews = () => {
        fetch(`review/teacher/${teacherId}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Reviews not found");
                    return;
                }
                setReviews(res.body as ReviewType[]);
                setLatestReviews(res.body as ReviewType[]);
                setAverageRating(res.body as ReviewType[]);
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    };

    return [
        { reviews, latestRewiews, averageRating },
        updateReviews,
    ] as const;
}