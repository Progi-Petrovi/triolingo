import ReactBigCalendar from "@/components/ReactBigCalendar";
import { LessonType as LessonEvent, LessonDTO } from "@/types/lesson";

import "@/calendar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserContext from "@/context/use-user-context";
import AddLessonTeacherForm from "@/components/AddLessonTeacherForm";
import { useFetch } from "@/hooks/use-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "react-big-calendar";

export default function Calendar() {
    const { user, fetchUser } = useUserContext();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    const fetch = useFetch();

    const [lessons, setLessons] = useState<any>([]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const loadTeacherLessons = () => {
        fetch(`lesson/teacher/${user.id}`)
            .then((res) => {
                console.log("FETCHED LESSONS", res);
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                console.log("Lessons: ", res.body);
                setLessons(
                    res.body.map((lesson: LessonDTO) => ({
                        start: new Date(lesson.startInstant),
                        end: new Date(lesson.endInstant),
                        title: lesson.language + " lesson " + lesson.id,
                        teacher: lesson.teacher,
                        teacherProfileUrl: `/teacher/${lesson.teacher}`,
                        status: lesson.status,
                    }))
                );
            })
            .catch((error) => console.error("Error fetching lessons:", error));
    };

    const loadStudentLessons = () => {
        fetch(`lesson/student/${user.id}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                console.log("Lessons: ", res.body);
                setLessons(
                    res.body.map((lesson: LessonDTO) => ({
                        id: lesson.id,
                        start: new Date(lesson.startInstant),
                        end: new Date(lesson.endInstant),
                        title: lesson.language + " lesson " + lesson.id,
                        teacher: lesson.teacher,
                        teacherProfileUrl: `/teacher/${lesson.teacher}`,
                        status: lesson.status,
                    }))
                );
            })
            .catch((error) => console.error("Error fetching lessons:", error));
    };

    /* TODO: add lesson requests */
    useEffect(() => {
        if (user.role === "ROLE_TEACHER") loadTeacherLessons();
        else if (user.role === "ROLE_STUDENT") loadStudentLessons();
    }, [user.id]);

    function StudentLesson({ event }: { event: LessonEvent }) {
        return (
            <span>
                <strong>{event.title}</strong> <br />
                <Link to={event.teacherProfileUrl}>{event.teacher}</Link>
            </span>
        );
    }

    function TeacherLesson({ event }: { event: LessonEvent }) {
        return (
            <span>
                <strong>{event.title}</strong>
            </span>
        );
    }

    const [view, setView] = useState<View>("month");

    let eventComponent = StudentLesson;

    if (user.role === "ROLE_TEACHER") {
        eventComponent = TeacherLesson;
    }

    return (
        <div
            className={`App ${
                view + "-active"
            } flex flex-col md:flex-row items-center gap-4 m-2 w-full`}
        >
            <ReactBigCalendar
                lessons={lessons}
                eventComponent={eventComponent}
                setView={setView}
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
