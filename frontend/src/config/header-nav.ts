import PathConstants from "@/routes/pathConstants";
import { MainNavItem } from "@/types/nav";

const nav = [
  {
    title: "Login",
    href: PathConstants.LOGIN,
  },
  {
    title: "Register",
    href: PathConstants.STUDENT_REGISTER,
  },
  {
    title: "Become a teacher",
    href: PathConstants.TEACHER_REGISTER,
  },
];

export interface NavConfig {
  mainNav: MainNavItem[];
  mainNavMobile: MainNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: nav,
  mainNavMobile: [
    {
      title: "Home",
      href: PathConstants.HOME,
    },
    ...nav,
  ],
};
