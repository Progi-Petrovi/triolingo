import ReactBigCalendar from "@/components/ReactBigCalendar";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LessonType } from "@/types/lesson";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatEndTime, formatLessonDate, formatStartTime } from "@/utils/main";
import { CalendarComponent } from "@/types/calendar";
import { useWSStudentRequests } from "@/hooks/use-socket";
import {
    useLoadStudentRequests,
    useLoadTeacherLessons,
} from "@/hooks/use-lessons";
import { Role, User } from "@/types/users";

export default function BookLessonStudent() {
    const { user, fetchUser } = useUserContext();

    const { id } = useParams<{ id: string }>();
    const fetch = useFetch();

    const [teacherLessons, loadTeacherLessons] = useLoadTeacherLessons(id);
    const [studentRequests, loadStudentRequests] = useLoadStudentRequests();

    const { toast } = useToast();

    const loadLessonsAndRequests = () => {
        loadTeacherLessons();
        loadStudentRequests();
    };

    const useClient = useWSStudentRequests(
        user as User,
        loadLessonsAndRequests
    );

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        loadLessonsAndRequests();
        useClient();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== Role.ROLE_STUDENT) {
        return <div>Only students can book lessons</div>;
    }

    if (!teacherLessons) {
        return <div>Loading...</div>;
    }

    const sendLessonRequest = (lessonRequest: LessonType) => {
        console.log("Sending lesson request: ", lessonRequest);

        fetch(`lesson/request/${lessonRequest.id}`, {
            method: "POST",
        }).then((res) => {
            if (res.status === 200) {
                toast({
                    title: "Lesson request sent successfully",
                });

                loadLessonsAndRequests();
            } else {
                toast({
                    title: "Failed to send lesson request",
                    variant: "destructive",
                });
            }
        });
    };

    const isPending = (lessonId: number) => {
        const lessonRequest = studentRequests.find(
            (request) => request.lessonId === lessonId
        );

        if (lessonRequest === undefined) return false;

        return lessonRequest?.status === "PENDING";
    };

    console.log("Teacher lessons: ", teacherLessons);
    console.log("Student lesson requests: ", studentRequests);

    const avaliableLessons = teacherLessons.filter(
        (lessonRequest) => lessonRequest.status === "OPEN"
    );

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div
                className={`calendar flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-4 m-2 w-full lg:flex-wrap`}
            >
                <div className="flex flex-col gap-4">
                    <h1>Your lessons</h1>
                    <ReactBigCalendar
                        lessonRequests={studentRequests}
                        componentType={CalendarComponent.STUDENT_COMPONENT}
                    />
                </div>
                <Card className="pb-4">
                    <CardHeader className="flex items-center">
                        Avaliable lessons from{" "}
                        <Link to={`/teacher/${id}`}>
                            {" "}
                            {teacherLessons &&
                                teacherLessons.length > 0 &&
                                teacherLessons[0].teacherFullName}
                        </Link>
                    </CardHeader>

                    {avaliableLessons && avaliableLessons.length > 0 ? (
                        <CardContent className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                            {avaliableLessons.map(
                                (lessonRequest: LessonType) => (
                                    <Card key={lessonRequest.title}>
                                        <CardHeader>
                                            <span className="font-bold">
                                                {lessonRequest.title}
                                            </span>
                                            @{" "}
                                            {formatLessonDate(
                                                lessonRequest.start
                                            )}{" "}
                                            {formatStartTime(
                                                lessonRequest.start
                                            )}{" "}
                                            - {formatEndTime(lessonRequest.end)}
                                            <br />
                                            <span>
                                                €{lessonRequest.teacherPayment}
                                            </span>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-4">
                                            {isPending(lessonRequest.id) ? (
                                                <Button disabled>
                                                    Request sent
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        sendLessonRequest(
                                                            lessonRequest
                                                        );
                                                    }}
                                                >
                                                    Request lesson
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            )}
                        </CardContent>
                    ) : (
                        <div
                            className="flex justify-center items-center pb-2
                        "
                        >
                            No lessons available
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
