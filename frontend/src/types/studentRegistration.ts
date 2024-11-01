import { LanguageLevel } from "./languageLevel";

export type StudentRegistration = {
  fullName: string;
  email: string;
  password: string;
  repeatPassword: string;
  teachingStyle: "Individual" | "Group" | "Flexible";
  goals: string;
  languages: LanguageLevel[];
};
