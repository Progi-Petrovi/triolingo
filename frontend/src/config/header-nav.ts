import PathConstants from "@/routes/pathConstants"
import { MainNavItem } from "@/types/nav"

export interface NavConfig {
  mainNav: MainNavItem[]
}

export const navConfig: NavConfig = {
  mainNav: [
    // {
    //   title: "Home",
    //   href: PathConstants.HOME,
    // },
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
  ]
}