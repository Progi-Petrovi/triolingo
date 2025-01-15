export type LessonType = {
    id: number;
    start: Date;
    end: Date;
    title: string;
    teacher: string;
    teacherFullName: string;
    teacherProfileUrl: string;
    teacherProfileImageHash: string;
    teacherPayment: number;
    status: string;
};

export interface LessonDTO {
    id: number;
    startInstant: string;
    endInstant: string;
    language: string;
    teacher: number;
    teacherFullName: string;
    teacherPayment: number;
    teacherProfileImageHash: string
    status: string;
}

export type LessonRequest = {
    id: number;
    lessonId: number;
    start: Date;
    end: Date;
    title: string;
    teacher: string;
    teacherFullName: string;
    teacherProfileUrl: string;
    teacherPayment: number;
    teacherProfileImageHash: string;
    student: string;
    status: string;
}

export interface LessonRequestDTO {
    id: number;
    lessonId: number;
    teacherId: number;
    teacherFullName: string;
    studentFullName: string;
    startInstant: string;
    endInstant: string;
    language: string;
    status: string;
    teacherProfileImageHash: string;
    teacherPayment: number;
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
    COMPLETED = "COMPLETE",
}