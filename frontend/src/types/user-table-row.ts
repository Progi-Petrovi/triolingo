import { TeachingStyle } from "./teaching-style";

export type TeacherTableRow = {
    id: number;
    fullName: string;
    languages: string[];
    teachingStyle: TeachingStyle;
    yearsOfExperience: number;
    hourlyRate: number;
};

export type UserTableRowForAdmin = {
    id: number;
    fullName: string;
    email: string;
};
