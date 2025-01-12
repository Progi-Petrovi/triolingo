import PathConstants from "@/routes/pathConstants";
import { MainNavItem } from "@/types/nav";

const guestNav = [
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

const userNav = [
    {
        title: "Profile",
        href: PathConstants.PROFILE,
    },
    {
        title: "Calendar",
        href: PathConstants.CALENDAR,
    },
    {
        title: "Log out",
        href: PathConstants.LOG_OUT,
    },
];

export interface NavConfig {
    mainNav: MainNavItem[];
    mainNavMobile: MainNavItem[];
}

export const guestNavConfig: NavConfig = {
    mainNav: guestNav,
    mainNavMobile: [
        {
            title: "Home",
            href: PathConstants.HOME,
        },
        ...guestNav,
    ],
};

export const userNavConfig: NavConfig = {
    mainNav: userNav,
    mainNavMobile: [
        {
            title: "Home",
            href: PathConstants.HOME,
        },
        ...userNav,
    ],
};
