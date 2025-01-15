import {
    guestNavConfig,
    NavConfig,
    adminNavConfig,
    studentNavConfig,
    teacherNavConfig,
} from "@/config/header-nav";
import PathConstants from "@/routes/pathConstants";
import { LessonDTO, LessonRequestDTO, LessonType } from "@/types/lesson";
import { Role, User } from "@/types/users";
import moment from "moment";
import { useFetch } from "@/hooks/use-fetch";

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

    const roleNav = {
        [Role.ROLE_ADMIN]: adminNavConfig,
        [Role.ROLE_STUDENT]: studentNavConfig,
        [Role.ROLE_TEACHER]: teacherNavConfig,
    }

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

export const lessonRequestDTOtoLessonRequest = (lessonRequestDTO: LessonRequestDTO) => ({
    id: lessonRequestDTO.id,
    start: new Date(lessonRequestDTO.startInstant),
    end: new Date(lessonRequestDTO.endInstant),
    title: lessonRequestDTO.language + " lesson " + lessonRequestDTO.lessonId,
    teacherFullName: lessonRequestDTO.teacherFullName,
    teacher: lessonRequestDTO.teacherId.toString(),
    teacherProfileUrl: `/teacher/${lessonRequestDTO.teacherId}`,
    teacherProfileImageHash: lessonRequestDTO.teacherProfileImageHash,
    student: lessonRequestDTO.studentFullName,
    status: lessonRequestDTO.status,
    lessonId: lessonRequestDTO.lessonId,
    teacherPayment: lessonRequestDTO.teacherPayment,  
});

export const lessonDTOtoLesson = (lessonDTO: LessonDTO): LessonType => ({
    id: lessonDTO.id,
    start: new Date(lessonDTO.startInstant),
    end: new Date(lessonDTO.endInstant),
    title: lessonDTO.language + " lesson " + lessonDTO.id,
    teacher: lessonDTO.teacher.toString(),
    teacherProfileUrl: `/teacher/${lessonDTO.teacher}`,
    teacherFullName: lessonDTO.teacherFullName,
    teacherPayment: lessonDTO.teacherPayment,
    teacherProfileImageHash: lessonDTO.teacherProfileImageHash,
    status: lessonDTO.status,
});

export const lessonRequestDTOsToLessonRequests = (
    lessonRequestDTOs : LessonRequestDTO[]
) => {
    return lessonRequestDTOs.map(lessonRequestDTOtoLessonRequest);
};

export const lessonDTOsToLessons = (lessonDTOs: LessonDTO[]) => {
    return lessonDTOs.map(lessonDTOtoLesson);
}

export const getNavLinkId = (title: string) => {
    return "nav-link-" + title.toLowerCase().replace(" ", "-");
};

export function deleteProfile(role: Role, id: number, toast: any, navigate: any) {
    const fetch = useFetch();

    const roleName = role === Role.ROLE_ADMIN ? "admin" : role === Role.ROLE_STUDENT ? "student" : "teacher";

    fetch(`/user/${id}`, {
        method: "DELETE",
    }).then((res) => {
        if (res.status === 200) {
            toast({
                title: `Successfully deleted ${roleName} with id: ${id}`,
            });
            navigate(PathConstants.HOME);
        } else {
            toast({
                title: `Failed to delete ${roleName} with id: ${id}`,
            });
        }
    });
}