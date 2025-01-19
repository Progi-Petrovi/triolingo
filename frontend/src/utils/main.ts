/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    guestNavConfig,
    NavConfig,
    adminNavConfig,
    studentNavConfig,
    teacherNavConfig,
} from "@/config/header-nav";
import PathConstants from "@/routes/pathConstants";
import {
    Lesson,
    LessonRequestStatus,
    LessonRequest,
    LessonStatus,
    LessonAggregate,
    LessonRequestAggregate,
    LessonBulkAggregate,
    LessonRequestBulkAggregate,
} from "@/types/lesson";
import { Role, Student, Teacher, User } from "@/types/users";
import moment from "moment";
import { useFetch } from "@/hooks/use-fetch";

export function initials(fullName: string): string {
    const initials = fullName.split(" ").map((name) => name[0]);

    if (initials.length === 1) {
        return initials[0];
    }
    return [initials[0], initials[initials.length - 1]].join("");
}

export function renderHeader(user: User | null): NavConfig {
    if (!user) {
        return guestNavConfig;
    }

    const roleNav = {
        [Role.ROLE_ADMIN]: adminNavConfig,
        [Role.ROLE_STUDENT]: studentNavConfig,
        [Role.ROLE_TEACHER]: teacherNavConfig,
    };

    return roleNav[user.role];
}

export const formatLessonDate = (date: Date) => {
    return moment(date).format("MMMM Do YYYY");
};

export const formatStartTime = (date: Date) => {
    return moment(date).format("HH:mm");
};

export const formatEndTime = (date: Date) => {
    return moment(date).format("HH:mm");
};

export const lessonRequestAggregatetoLessonRequest = async (
    requestAggregate: LessonRequestAggregate,
    lesson?: Lesson | undefined
): Promise<LessonRequest> => {
    if (lesson === undefined)
        lesson = await lessonAggregatetoLesson(
            requestAggregate.lessonAggregate as LessonAggregate
        );
    const student: Student = {
        ...(requestAggregate.student as Student),
        role: Role.ROLE_STUDENT,
    } as Student;

    return {
        id: requestAggregate.request.id,
        lesson,
        student,
        status: LessonRequestStatus[
            requestAggregate.request.status as keyof typeof LessonRequestStatus
        ],
    };
};

export const lessonAggregatetoLesson = async (
    lessonAggregate: LessonAggregate
): Promise<Lesson> => {
    const teacher: Teacher = {
        ...(lessonAggregate.teacher as Teacher),
        role: Role.ROLE_TEACHER,
    } as Teacher;

    return {
        id: lessonAggregate.lesson.id,
        start: new Date(lessonAggregate.lesson.startInstant),
        end: new Date(lessonAggregate.lesson.endInstant),
        title:
            lessonAggregate.lesson.language +
            " lesson " +
            lessonAggregate.lesson.id,
        language: lessonAggregate.lesson.language,
        teacher,
        teacherPayment: lessonAggregate.lesson.teacherPayment,
        status: LessonStatus[
            lessonAggregate.lesson.status as keyof typeof LessonStatus
        ],
    };
};

export const lessonRequestBulkAggregateToLessonRequests = async (
    lessonRequestBulkAggregate: LessonRequestBulkAggregate
) => {
    const requests: LessonRequest[] = [];
    const lessons: Lesson[] = await lessonBulkAggregateToLessons(
        lessonRequestBulkAggregate.lessonBulkAggregate
    );
    for (const requestDTO of lessonRequestBulkAggregate.requests) {
        const lesson: Lesson = lessons.find(
            (lesson) => lesson.id === requestDTO.lesson
        ) as Lesson;
        const student: Student = lessonRequestBulkAggregate.students.find(
            (student) => student.id === requestDTO.student
        ) as Student;
        requests.push(
            await lessonRequestAggregatetoLessonRequest(
                {
                    student,
                    request: requestDTO,
                },
                lesson
            )
        );
    }

    return requests;
};

export const lessonBulkAggregateToLessons = async (
    lessonBulkAggregate: LessonBulkAggregate
): Promise<Lesson[]> => {
    const lessons: Lesson[] = [];
    for (const lessonDTO of lessonBulkAggregate.lessons) {
        const teacher: Teacher = lessonBulkAggregate.teachers.find(
            (teacher) => teacher.id === lessonDTO.teacher
        ) as Teacher;
        lessons.push(
            await lessonAggregatetoLesson({ lesson: lessonDTO, teacher })
        );
    }
    return lessons;
};

export const getNavLinkId = (title: string) => {
    return "nav-link-" + title.toLowerCase().replace(" ", "-");
};

export function deleteProfile(
    role: Role,
    id: number,
    toast: any,
    navigate: any,
    logoutUser: () => void,
    profileOwner?: boolean
) {
    const fetch = useFetch();

    const roleName =
        role === Role.ROLE_ADMIN
            ? "admin"
            : role === Role.ROLE_STUDENT
            ? "student"
            : "teacher";

    const fetchLink = () => {
        if (profileOwner) {
            return roleName;
        }

        return `user/${id}`;
    };

    fetch(`${fetchLink()}`, {
        method: "DELETE",
    }).then((res) => {
        if (res.status === 200) {
            toast({
                title: !profileOwner
                    ? `Successfully deleted ${roleName} with id: ${id}`
                    : "Your account has been sucessfully deleted.",
            });
            if (profileOwner) {
                logoutUser();
            }
            navigate(PathConstants.HOME);
        } else {
            toast({
                title: !profileOwner
                    ? `Failed to delete ${roleName} with id: ${id}`
                    : "Failed to delete your account",
            });
        }
    });
}

function toEnglishCase(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function enumObjectToString(enumObject: Record<string, string>, key: string) {
    return enumObject[key].split("_").map(toEnglishCase).join(" ");
}

export function enumToStringList(enumObject: Record<string, string>) {
    return Object.keys(enumObject).map((key) =>
        enumObjectToString(enumObject, key)
    );
}

export const toEnum = (str: string) => {
    return str.toUpperCase().replace(/ /g, "_") as string;
};
