import {
    userNavConfig,
    guestNavConfig,
    NavConfig,
    adminNavConfig,
    studentNavConfig,
    teacherNavConfig,
} from "@/config/header-nav";
import { LessonRequestDTO } from "@/types/lesson";
import { Role, User } from "@/types/users";
import moment from "moment";

export function initials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name[0])
        .join("");
}

export function renderHeader(user: User | null): NavConfig {
    if (!user) {
        return guestNavConfig;
    }
    if (user.role === Role.ROLE_ADMIN) {
        return adminNavConfig;
    }
    if (user.role === Role.ROLE_STUDENT) {
        return studentNavConfig;
    }

    return teacherNavConfig;
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

export const lessonRequestDTOtoLessonRequest = (
        lessonRequestDTO: LessonRequestDTO
    ) => {
        return {
            id: lessonRequestDTO.id,
            start: new Date(lessonRequestDTO.startInstant),
            end: new Date(lessonRequestDTO.endInstant),
            title: lessonRequestDTO.language + " lesson " + lessonRequestDTO.id,
            teacher: lessonRequestDTO.teacherFullName,
            teacherProfileUrl: "",
            student: lessonRequestDTO.studentFullName,
            status: lessonRequestDTO.status,
            lessonId: lessonRequestDTO.lessonId,
        };
    };