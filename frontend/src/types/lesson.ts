import { Student, Teacher } from "./users";

export type Lesson = {
	id: number;
	start: Date;
	end: Date;
	title: string;
	language: string;
	teacher: Teacher;
	teacherPayment: number;
	status: LessonStatus;
};

export interface LessonDTO {
	id: number;
	startInstant: string;
	endInstant: string;
	language: string;
	teacher: number;
	status: string;
	teacherPayment: number;
}

export type LessonRequest = {
	id: number;
	lesson: Lesson;
	student: Student;
	status: LessonRequestStatus;
};

export interface LessonRequestDTO {
	id: number;
	student: number;
	lesson: number;
	status: string;
}

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
