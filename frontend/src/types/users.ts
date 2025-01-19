import { LanguageLevel } from "./language-level";
import { TeachingStyle } from "./teaching-style";

export enum Role {
    ROLE_TEACHER = "ROLE_TEACHER",
    ROLE_STUDENT = "ROLE_STUDENT",
    ROLE_ADMIN = "ROLE_ADMIN",
}

export type User = {
    id: number;
    email: string;
    fullName: string;
    role: Role;
    verified: boolean;
};

export type Teacher = User & {
    languages: string[];
    yearsOfExperience: number;
    qualifications: string;
    teachingStyle: TeachingStyle;
    profileImageHash: string | null;
    hourlyRate: number;
    phoneNumber: string;
};

export type Student = User & {
    learningLanguages: LanguageLevel[];
    preferredTeachingStyle: TeachingStyle;
    learningGoals: string;
};
