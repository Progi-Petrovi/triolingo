import ReactBigCalendar from "@/components/ReactBigCalendar";
import { useEffect } from "react";
import useUserContext from "@/context/use-user-context";
import AddLessonTeacherForm from "@/components/AddLessonTeacherForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarComponent } from "@/types/calendar";
import { User } from "@/types/users";
import { useWSLessonRequests } from "@/hooks/use-socket";
import {
    useLoadStudentRequests as useLoadStudentRequests,
    useLoadTeacherLessons,
} from "@/hooks/use-lessons";

export default function Calendar() {
    const { user, fetchUser } = useUserContext();

    const [lessons, loadTeacherLessons] = useLoadTeacherLessons();
    const [lessonRequests, loadStudentRequests] = useLoadStudentRequests();

    const teacherWSCallback = (_message: any) => {
        console.log("Teacher WS Callback");
        console.log("Message: ", _message);
    };

    const useRequestsClient = useWSLessonRequests({
        user: user as User,
        teacherCallback: loadTeacherLessons,
        studentCallback: loadStudentRequests,
        teacherWSCallback,
    });

    useEffect(() => {
        if (!user) {
            fetchUser();
        } else {
            useRequestsClient();
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    let componentType =
        user.role === "ROLE_TEACHER"
            ? CalendarComponent.TEACHER_COMPONENT
            : CalendarComponent.STUDENT_COMPONENT;

    console.log("Lessons: ", lessons);

    return (
        <div
            className={`App flex flex-col md:flex-row items-center gap-4 m-2 w-full`}
        >
            <ReactBigCalendar
                lessons={lessons}
                lessonRequests={lessonRequests}
                componentType={componentType}
            />
            {user.role === "ROLE_TEACHER" && (
                <Card className="w-96 flex-1 max-w-[95vw]">
                    <CardHeader>
                        <CardTitle>Add Lesson Opening</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AddLessonTeacherForm onSuccess={loadTeacherLessons} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
