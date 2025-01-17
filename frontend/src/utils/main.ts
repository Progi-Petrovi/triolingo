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
    LessonDTO,
    LessonRequestDTO,
    Lesson,
    LessonRequestStatus,
    LessonRequest,
    LessonStatus,
} from "@/types/lesson";
import { Role, Student, Teacher, User } from "@/types/users";
import moment from "moment";
import { useFetch } from "@/hooks/use-fetch";


export function initials(fullName: string): string {
    const initials = fullName.split(" ").map((name) => name[0]);
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

export const lessonRequestDTOtoLessonRequest = async (
    lessonRequestDTO: LessonRequestDTO
): Promise<LessonRequest> => {
    const fetch = useFetch();

    const resLesson = await fetch(`/lesson/${lessonRequestDTO.lesson}`);
    const lesson: Lesson = await lessonDTOtoLesson(resLesson.body as LessonDTO);

    const resStudent = await fetch(`/student/${lessonRequestDTO.student}`);
    const student: Student = {
        ...(resStudent.body as Student),
        role: Role.ROLE_STUDENT,
    } as Student;

    return {
        id: lessonRequestDTO.id,
        lesson,
        student,
        status: LessonRequestStatus[
            lessonRequestDTO.status as keyof typeof LessonRequestStatus
        ],
    };
};

export const lessonDTOtoLesson = async (
    lessonDTO: LessonDTO
): Promise<Lesson> => {
    const fetch = useFetch();

    const res = await fetch(`/teacher/${lessonDTO.teacher}`);

    const teacher: Teacher = {
        ...(res.body as Teacher),
        role: Role.ROLE_TEACHER,
    } as Teacher;

    return {
        id: lessonDTO.id,
        start: new Date(lessonDTO.startInstant),
        end: new Date(lessonDTO.endInstant),
        title: lessonDTO.language + " lesson " + lessonDTO.id,
        language: lessonDTO.language,
        teacher,
        teacherPayment: lessonDTO.teacherPayment,
        status: LessonStatus[lessonDTO.status as keyof typeof LessonStatus],
    };
};

export const lessonRequestDTOsToLessonRequests = async (
    lessonRequestDTOs: LessonRequestDTO[]
) => {
    return Promise.all(
        lessonRequestDTOs.map(
            async (dto) => await lessonRequestDTOtoLessonRequest(dto)
        )
    );
};

export const lessonDTOsToLessons = async (lessonDTOs: LessonDTO[]) => {
    return Promise.all(
        lessonDTOs.map(async (dto) => await lessonDTOtoLesson(dto))
    );
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

export function enumToString(enumObject: Record<string, string>) : (key: string) => string {
    return (key: string) => {return enumObjectToString(enumObject, key)};
}

export function optionsMapToSelectValuesMap(enumType: any, optionsMap: any) {
    const selectValueMap: any = {};
    const enumOptionsToString = enumToString(enumType);

    for (const key in enumType) {
        if (optionsMap.hasOwnProperty(enumType[key])) {
            selectValueMap[enumOptionsToString(enumType[key])] = optionsMap[enumType[key]];
        }
    }

    return selectValueMap;
}

export function enumToStringList(enumObject: Record<string, string>) {
    return Object.keys(enumObject).map((key) =>
        enumObjectToString(enumObject, key)
    );
}

export const toEnum = (str: string) => {
    return str.toUpperCase().replace(/ /g, "_") as string;
};
