import { Card, CardContent } from "@/components/ui/card";
import useUserContext from "@/context/use-user-context";
import { useLoadStudentRequests } from "@/hooks/use-lessons";
import { useWSStudentRequests } from "@/hooks/use-socket";
import { Role, User } from "@/types/users";
import { formatLessonDate, formatStartTime, formatEndTime } from "@/utils/main";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PendingRequests() {
    const { user, fetchUser } = useUserContext();

    const [studentRequests, loadStudentRequests] = useLoadStudentRequests();

    const loadLessonsAndRequests = () => {
        loadStudentRequests();
    };

    const { subscribe, unsubscribe } = useWSStudentRequests(user as User, loadLessonsAndRequests);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        loadLessonsAndRequests();
        subscribe();
        return unsubscribe();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== Role.ROLE_STUDENT) {
        return <div>Only students can see pending requests</div>;
    }

    const pendingLessonRequests = studentRequests.filter(
        (lessonRequest) => lessonRequest.status === "PENDING"
    );

    console.log("Pending lesson requests: ", pendingLessonRequests);
    console.log("Student requests: ", studentRequests);

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1>Pending Requests</h1>

            <Card className="pt-6">
                <CardContent className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                    {pendingLessonRequests.length > 0 ? (
                        pendingLessonRequests.map((lessonRequest) => (
                            <Card key={lessonRequest.id}>
                                <CardContent className="flex flex-col justify-center items-center pt-4 pb-4 gap-4">
                                    <span className="font-bold">{lessonRequest.lesson.title}</span>
                                    <span>
                                        @ {formatLessonDate(lessonRequest.lesson.start)}{" "}
                                        {formatStartTime(lessonRequest.lesson.start)} -{" "}
                                        {formatEndTime(lessonRequest.lesson.end)}
                                    </span>
                                    <span>
                                        Teacher:{" "}
                                        <Link to={`/teacher/${lessonRequest.lesson.teacher.id}`}>
                                            {lessonRequest.lesson.teacher.fullName}
                                        </Link>
                                    </span>
                                    <span>€{lessonRequest.lesson.teacherPayment}</span>
                                </CardContent>
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
