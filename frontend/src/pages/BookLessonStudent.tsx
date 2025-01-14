import { View } from "react-big-calendar";
import ReactBigCalendar from "@/components/ReactBigCalendar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    LessonDTO,
    LessonType as LessonEvent,
    LessonRequest,
    LessonRequestDTO,
} from "@/types/lesson";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import "@/calendar.css";
import { Teacher } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    formatEndTime,
    formatLessonDate,
    formatStartTime,
    lessonRequestDTOtoLessonRequest,
} from "@/utils/main";
import { set } from "date-fns";

export default function BookLessonStudent() {
    const { user, fetchUser } = useUserContext();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== "ROLE_STUDENT") {
        return <div>Only students can book lessons</div>;
    }

    const { id } = useParams<{ id: string }>();
    const fetch = useFetch();
    const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
    const [teacherLessons, setTeacherLessons] = useState<LessonEvent[]>([]);
    const [teacher, setTeacher] = useState<Teacher>();
    const [view, setView] = useState<View>("month");

    const { toast } = useToast();

    const loadTeacherAndLessons = () => {
        fetch(`teacher/${id}`).then((res) => {
            if (res.status === 404) {
                console.error("Teacher not found");
                return;
            }
            setTeacher(res.body);
        });

        fetch(`lesson/teacher/${id}`)
            .then((res) => {
                console.log("FETCHED LESSONS", res);
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                console.log("Lessons: ", res.body);
                setTeacherLessons(
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

        fetch(`lesson/requests/student`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                const lessonRequests = res.body as LessonRequestDTO[];
                console.log("Lessons requests by student: ", res.body);

                setLessonRequests(
                    lessonRequests.map((lessonRequest) => {
                        return lessonRequestDTOtoLessonRequest(lessonRequest);
                    })
                );
            })
            .catch((error) => console.error("Error fetching lessons:", error));
    };

    useEffect(() => {
        loadTeacherAndLessons();
    }, [id]);

    function StudentLesson({ event }: { event: LessonEvent }) {
        return (
            <span>
                <strong>{event.title}</strong> <br />
                <Link to={event.teacherProfileUrl}>{event.teacher}</Link>
            </span>
        );
    }

    if (!teacher) {
        return <div>Loading...</div>;
    }

    const disableButton = (lessonId: number) => {
        // remove the lessonRequest from the list
        setLessonRequests((prev) =>
            prev.filter((lessonRequest) => lessonRequest.id !== lessonId)
        );
    };

    const sendLessonRequest = (lesson: LessonEvent) => {
        fetch(`lesson/request/${lesson.id}`, {
            method: "POST",
        }).then((res) => {
            if (res.status === 200) {
                console.log("Lesson request sent successfully");
                toast({
                    title: "Lesson request sent successfully",
                });
                disableButton(lesson.id);
            } else {
                console.error("Failed to send lesson request");
                toast({
                    title: "Failed to send lesson request",
                    variant: "destructive",
                });
            }
        });
    };

    const isRequested = (lessonId: number) => {
        return (
            lessonRequests.find((request) => request.id === lessonId) !==
            undefined
        );
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div
                className={`App ${
                    view + "-active"
                } flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-4 m-2 w-full lg:flex-wrap`}
            >
                <div className="flex flex-col gap-4">
                    <h1>Your lessons</h1>
                    <ReactBigCalendar
                        lessonRequests={lessonRequests}
                        setView={setView}
                        eventComponent={StudentLesson}
                    />
                </div>
                <Card className="pb-4">
                    <CardHeader className="flex items-center">
                        Avaliable lessons from{" "}
                        <Link to={`/teacher/${id}`}> {teacher.fullName}</Link>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                        {teacherLessons
                            .filter((lesson) => lesson.status === "OPEN")
                            .map((lesson) => (
                                <Card key={lesson.title}>
                                    <CardHeader>
                                        <span className="font-bold">
                                            {lesson.title}
                                        </span>{" "}
                                        @ {formatLessonDate(lesson.start)}{" "}
                                        {formatStartTime(lesson.start)} -{" "}
                                        {formatEndTime(lesson.end)}
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <Button
                                            onClick={() => {
                                                sendLessonRequest(lesson);
                                            }}
                                            id={
                                                "lesson-btn-" +
                                                lesson.id.toString()
                                            }
                                            disabled={isRequested(lesson.id)}
                                        >
                                            {isRequested(lesson.id)
                                                ? "Request sent"
                                                : "Request lesson"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
