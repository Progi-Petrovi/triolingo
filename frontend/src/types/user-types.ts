import { TeachingStyle } from "./teaching-style";

export enum Role {
    ROLE_TEACHER = "ROLE_TEACHER",
    ROLE_STUDENT = "ROLE_STUDENT",
    ROLE_ADMIN = "ROLE_ADMIN",
}

export type Teacher = {
    id: number;
    fullName: string;
    hourlyRate: number;
    languages: string[];
    profilePictureHash: string | null;
    qualifications: string;
    teachingStyle: TeachingStyle;
    yearsOfExperience: number;
};
