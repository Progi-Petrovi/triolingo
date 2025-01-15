import { LessonDTO, LessonRequest, LessonRequestDTO, LessonRequestStatus, LessonStatus, LessonType } from "@/types/lesson";
import { lessonDTOsToLessons, lessonRequestDTOsToLessonRequests } from "@/utils/main";
import { useFetch } from "./use-fetch";
import { useState } from "react";

export function useLoadTeacherLessons(id?: string) {
    const fetch = useFetch();
    const [lessons, setLessons] = useState<LessonType[]>([]);

    const updateLessons = () => {
        fetch("lesson/teacher" + (id ? `/${id}` : ""))
            .then(async (res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                const lessons = res.body as LessonDTO[];
                setLessons(lessonDTOsToLessons(lessons));
            })
            .catch((error) => console.error("Error fetching lessons:", error));
    }

    return [lessons, updateLessons] as const;
};

export function useLoadTeacherRequests() {
    const fetch = useFetch();
    const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);

    const getTeacherLessonRequests = () => {
        fetch("lesson/requests/teacher")
            .then((res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }

                const lessonRequestDtos = res.body as LessonRequestDTO[];
                setLessonRequests(
                    lessonRequestDTOsToLessonRequests(lessonRequestDtos).filter(
                        (lessonRequest) =>
                            lessonRequest.status === LessonRequestStatus.PENDING
                    )
                );
            })
            .catch((error) =>
                console.error("Error fetching lesson requests:", error)
            );
    };

    return [lessonRequests, getTeacherLessonRequests] as const;
}

const lessonRequestToStudentLessonRequest = (lessonRequest: LessonRequest): LessonRequest => {
    if (
        lessonRequest.status === LessonRequestStatus.ACCEPTED &&
        new Date() > lessonRequest.end
    ) {
        return {
            ...lessonRequest,
            status: LessonStatus.COMPLETED,
        };
    }
    return lessonRequest;
}

const requestDTOsToSudentRequests = (lessonRequests: LessonRequestDTO[]): LessonRequest[] => {
    return lessonRequestDTOsToLessonRequests(lessonRequests).map(
        (lessonRequest) => lessonRequestToStudentLessonRequest(lessonRequest)
    );
}

export function useLoadStudentRequests() {
    const fetch = useFetch();
    const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);

    const loadStudentRequests = () => {
        fetch(`lesson/requests/student`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Lessons not found");
                    return;
                }
                const lessonRequests = res.body as LessonRequestDTO[];
                console.log("lessonRequests", lessonRequests);
                setLessonRequests(
                    requestDTOsToSudentRequests(lessonRequests)
                );
            })
            .catch((error) => console.error("Error fetching lessons:", error));
    }

    return [lessonRequests, loadStudentRequests] as const;
}