import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { LessonRequest, LessonRequestDTO } from "@/types/lesson";
import {
    formatEndTime,
    formatLessonDate,
    formatStartTime,
    lessonRequestDTOtoLessonRequest,
} from "@/utils/main";
import { useEffect, useState } from "react";

export default function LessonRequests() {
    const { user, fetchUser } = useUserContext();

    const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
    const fetch = useFetch();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    useEffect(() => {
        fetch("lesson/requests/teacher")
            .then((res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }

                const lessonRequestsDto = res.body as LessonRequestDTO[];
                console.log("Lesson requests: ", lessonRequestsDto);

                setLessonRequests(
                    lessonRequestsDto.map((lessonRequest) => {
                        return lessonRequestDTOtoLessonRequest(lessonRequest);
                    })
                );
            })
            .catch((error) =>
                console.error("Error fetching lesson requests:", error)
            );
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== "ROLE_TEACHER") {
        return <div>Only teachers can view lesson requests</div>;
    }

    console.log("Requests: ", lessonRequests);

    // const acceptLessonRequest = (id: number) => {
    //     fetch(`lesson/request/${id}/accept`, {
    //         method: "POST",
    //     })
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 console.log("Lesson request accepted");
    //                 setLessonRequests((prev) =>
    //                     prev.filter((lessonRequest) => lessonRequest.id !== id)
    //                 );
    //             } else {
    //                 console.error("Error accepting lesson request");
    //             }
    //         })
    //         .catch((error) => console.error("Error accepting lesson request:", error));
    // };

    // const rejectLessonRequest = (id: number) => {
    //     fetch(`lesson/request/${id}/reject`, {
    //         method: "POST",
    //     })
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 console.log("Lesson request rejected");
    //                 setLessonRequests((prev) =>
    //                     prev.filter((lessonRequest) => lessonRequest.id !== id)
    //                 );
    //             } else {
    //                 console.error("Error rejecting lesson request");
    //             }
    //         })
    //         .catch((error) => console.error("Error rejecting lesson request:", error));
    // };

    const acceptLessonRequest = (id: number) => {
        const requestCard = document.getElementById(`request-${id}`);
        if (requestCard) {
            requestCard.style.display = "none";
        }
        console.log("Accepted lesson request: ", id);
    };

    const rejectLessonRequest = (id: number) => {
        const requestCard = document.getElementById(`request-${id}`);
        if (requestCard) {
            requestCard.style.display = "none";
        }
        console.log("Rejected lesson request: ", id);
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1>Lesson Requests</h1>

            <Card className="pt-6">
                <CardContent className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                    {lessonRequests && lessonRequests.length > 0 ? (
                        lessonRequests.map((lessonRequest) => (
                            <Card
                                key={lessonRequest.id}
                                id={`request-${lessonRequest.id}`}
                            >
                                <CardHeader>
                                    <span className="font-bold">
                                        {lessonRequest.title}
                                    </span>{" "}
                                    @ {formatLessonDate(lessonRequest.start)}{" "}
                                    {formatStartTime(lessonRequest.start)} -{" "}
                                    {formatEndTime(lessonRequest.end)}
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    Requested by: {lessonRequest.student}
                                </CardContent>
                                <CardFooter className="flex gap-4">
                                    <Button
                                        onClick={() => {
                                            acceptLessonRequest(
                                                lessonRequest.id
                                            );
                                        }}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            rejectLessonRequest(
                                                lessonRequest.id
                                            );
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div>No lesson requests</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
