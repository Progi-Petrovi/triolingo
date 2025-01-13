import { TeachingStyle } from "@/types/teaching-style";
import { KnowledgeLevel } from "@/types/language-level";

type UserRegistration = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type StudentRegistration = UserRegistration & {
    learningGoals: string;
    learningLanguages: Record<string, KnowledgeLevel>;
    preferredTeachingStyle: TeachingStyle;
};

export type TeacherRegistration = UserRegistration & {
    teachingStyle: TeachingStyle;
    yearsOfExperience: number;
    hourlyRate: number;
    qualifications: string;
    languages: string[];
};
