import ReactBigCalendar from "@/components/ReactBigCalendar";
import { useEffect } from "react";
import useUserContext from "@/context/use-user-context";
import AddLessonTeacherForm from "@/components/AddLessonTeacherForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarComponent } from "@/types/calendar";
import { Role } from "@/types/users";
import { useWSStudentRequests, useWSTeacherRequests } from "@/hooks/use-socket";
import {
    useLoadStudentRequests as useLoadStudentRequests,
    useLoadTeacherLessons,
} from "@/hooks/use-lessons";

export default function Calendar() {
    const { user, fetchUser } = useUserContext();

    const useClientTeacher = useWSTeacherRequests();
    const useClientStudent = useWSStudentRequests();

    const [lessons, loadTeacherLessons] = useLoadTeacherLessons();
    const [lessonRequests, loadStudentRequests] = useLoadStudentRequests();

    useEffect(() => {
        if (!user) {
            fetchUser();
        } else if (user.role === Role.ROLE_TEACHER) {
            loadTeacherLessons();
            useClientTeacher();
        } else if (user.role === Role.ROLE_STUDENT) {
            loadStudentRequests();
            useClientStudent();
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
