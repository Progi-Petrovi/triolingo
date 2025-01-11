import PathConstants from "@/routes/pathConstants";
import { MainNavItem } from "@/types/nav";

//TODO: based on a token from backend, use React's Context to hide Login, Register and Become a teacher if user is logged in
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
    {
        title: "Profile",
        href: PathConstants.PROFILE,
    },
    {
        title: "Calendar",
        href: PathConstants.CALENDAR,
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
