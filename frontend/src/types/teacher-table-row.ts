import { TeachingStyle } from "./teaching-style";

export type TeacherTableRow = {
  id: number;
  name: string;
  languages: string[];
  teachingStyle: TeachingStyle;
  yearsOfExperience: number;
  hourlyRate: number;
};
