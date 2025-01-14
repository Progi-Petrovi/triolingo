export type LessonType = {
    id: number;
    start: Date;
    end: Date;
    title: string;
    teacher: string;
    teacherProfileUrl: string;
    status: string;
};

export interface LessonDTO {
    id: number;
    startInstant: string;
    endInstant: string;
    language: string;
    teacher: number;
    teacherPayment: number;
    status: string;
}

export type LessonRequest = {
    id: number;
    lessonId: number;
    start: Date;
    end: Date;
    title: string;
    teacher: string;
    teacherProfileUrl: string;
    student: string;
    status: string;
}

export interface LessonRequestDTO {
    id: number;
    lessonId: number;
    teacherFullName: string;
    studentFullName: string;
    startInstant: string;
    endInstant: string;
    language: string;
    status: string;
    teacherProfilePictureHash: string;
};

export enum LessonRequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export enum LessonStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}