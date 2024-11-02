import { TeachingStyle } from "@/types/teaching-style";
import { LanguageLevel } from "@/types/language-level";

type UserRegistration = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  teachingStyle: TeachingStyle;
};

export type StudentRegistration = UserRegistration & {
  goals: string;
  languages: LanguageLevel[];
};

export type TeacherRegistration = UserRegistration & {
  yearsOfExperience: number;
  hourlyRate: number;
  qualifications: string;
  languages: string[];
};
