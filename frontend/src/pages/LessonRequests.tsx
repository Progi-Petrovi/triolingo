import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { LessonRequestStatus } from "@/types/lesson";
import { formatEndTime, formatLessonDate, formatStartTime } from "@/utils/main";
import { useEffect } from "react";
import { useLoadTeacherRequests } from "@/hooks/use-lessons";
import { useWSTeacherRequests } from "@/hooks/use-socket";
import { User } from "@/types/users";

export default function LessonRequests() {
    const { user, fetchUser } = useUserContext();
    const [pendingLessonRequests, getTeacherLessonRequests] =
        useLoadTeacherRequests();

    const fetch = useFetch();

    const useClient = useWSTeacherRequests(
        user as User,
        getTeacherLessonRequests
    );

    useEffect(() => {
        if (!user) {
            fetchUser();
        } else {
            getTeacherLessonRequests();
            useClient();
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== "ROLE_TEACHER") {
        return <div>Only teachers can view lesson requests</div>;
    }

    const modifyLessonRequest = (id: number, status: LessonRequestStatus) => {
        fetch(`lesson/request/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
            .then((res) => {
                if (res.status === 200) {
                    getTeacherLessonRequests();
                }
            })
            .catch((error) =>
                console.error("Error modifying lesson request:", error)
            );
    };

    const acceptLessonRequest = (id: number) => {
        modifyLessonRequest(id, LessonRequestStatus.ACCEPTED);
    };

    const rejectLessonRequest = (id: number) => {
        modifyLessonRequest(id, LessonRequestStatus.REJECTED);
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1>Lesson Requests</h1>

            <Card className="pt-6">
                <CardContent className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                    {pendingLessonRequests.length > 0 ? (
                        pendingLessonRequests.map((lessonRequest) => (
                            <Card key={lessonRequest.id}>
                                <CardHeader>
                                    <span className="font-bold">
                                        {lessonRequest.lesson.language} lesson{" "}
                                        {lessonRequest.lesson.id}
                                    </span>{" "}
                                    @{" "}
                                    {formatLessonDate(
                                        lessonRequest.lesson.start
                                    )}{" "}
                                    {formatStartTime(
                                        lessonRequest.lesson.start
                                    )}{" "}
                                    - {formatEndTime(lessonRequest.lesson.end)}
                                    <br />
                                    <span>
                                        €{lessonRequest.lesson.teacherPayment}
                                    </span>
                                    <br />
                                    <span>
                                        Requested by:{" "}
                                        {lessonRequest.student.fullName}
                                    </span>
                                </CardHeader>
                                <CardFooter className="flex gap-4">
                                    <Button
                                        onClick={() =>
                                            acceptLessonRequest(
                                                lessonRequest.id
                                            )
                                        }
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            rejectLessonRequest(
                                                lessonRequest.id
                                            )
                                        }
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
