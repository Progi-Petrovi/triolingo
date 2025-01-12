interface ReviewProps {
    review: {
        id: string;
        user: string;
        rating: number;
        comment: string;
        date: Date;
    };
}

const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={i <= rating ? "text-yellow-500" : "text-gray-300"}
            >
                ★
            </span>
        );
    }
    return <div className="flex">{stars}</div>;
};

export const Review = ({ review }: ReviewProps) => {
    return (
        <div className={"flex flex-col gap-1"} id={`review-${review.id}`}>
            <div className={"flex gap-4"}>
                <div className={"flex flex-col w-full"}>
                    <div
                        className={
                            "min-h-[30px] rounded-lg s-review-card border"
                        }
                    >
                        <div
                            className={
                                "h-[37px] w-full user rounded-t-lg flex items-center justify-between border-b"
                            }
                        >
                            <div className={"flex items-center px-3 gap-1"}>
                                <span className={"font-semibold"}>
                                    {review.user}
                                </span>
                                <StarRating rating={review.rating} />
                                <span className={"text-xs"}>
                                    {review.date.toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className={"p-3"}>
                            <p>{review.comment}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
