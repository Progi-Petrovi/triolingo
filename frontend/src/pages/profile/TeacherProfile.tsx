import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachingStyle } from "@/types/teaching-style";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/users";
import AddReviewDialog from "@/components/AddReviewDialog";
import { Review } from "@/components/Review";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useReviews } from "@/hooks/use-reviews";
import ProfileLayout from "./components/ProfileLayout";
import { ProfileProps } from "@/types/profile";

export default function TeacherProfile({
    userProfile,
    role,
    profileOwner,
}: ProfileProps) {
    const teacher = userProfile as Teacher;

    const maxReviews = 5;
    const [{ reviews, latestRewiews, averageRating }, updateReviews] =
        useReviews(maxReviews, teacher.id);

    useEffect(() => {
        updateReviews();
    }, []);

    function TeacherRight() {
        return (
            <>
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
                    <CardContent>
                        {teacher.teachingStyle as TeachingStyle}
                    </CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.qualifications
                            ? teacher.qualifications
                            : "No qualifications."}
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
            </>
        );
    }

    return (
        <ProfileLayout
            userProfile={userProfile}
            profileOwner={profileOwner}
            role={role}
        >
            <TeacherRight />
        </ProfileLayout>
    );
}
