import { TeachingStyle } from "./teaching-style";

export type TeacherTableRow = {
	id: number;
	fullName: string;
	languages: string[];
	teachingStyle: TeachingStyle;
	yearsOfExperience: number;
	hourlyRate: number;
};
