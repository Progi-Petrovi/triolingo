import { TeachingStyle } from "@/types/teaching-style";
import { LanguageLevel } from "@/types/language-level";

export type StudentRegistration = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  teachingStyle: TeachingStyle;
  goals: string;
  languages: LanguageLevel[];
};
