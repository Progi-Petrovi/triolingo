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

const teacherNav = [
    {
        title: "Profile",
        href: PathConstants.PROFILE,
    },
    {
        title: "Calendar",
        href: PathConstants.CALENDAR,
    },
    {
        title: "Lesson requests",
        href: PathConstants.LESSON_REQUESTS,
    },
    {
        title: "Log out",
        href: PathConstants.LOG_OUT,
    },
];

const studentNav = [
    {
        title: "Profile",
        href: PathConstants.PROFILE,
    },
    {
        title: "Calendar",
        href: PathConstants.CALENDAR,
    },
    {
        title: "Pending requests",
        href: PathConstants.PENDING_REQUESTS,
    },
    {
        title: "Log out",
        href: PathConstants.LOG_OUT,
    },
];

const adminNav = [
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

export const studentNavConfig: NavConfig = {
    mainNav: studentNav,
    mainNavMobile: [
        {
            title: "Home",
            href: PathConstants.HOME,
        },
        ...studentNav,
    ],
};

export const teacherNavConfig: NavConfig = {
    mainNav: teacherNav,
    mainNavMobile: [
        {
            title: "Home",
            href: PathConstants.HOME,
        },
        ...teacherNav,
    ],
};

export const adminNavConfig: NavConfig = {
    mainNav: adminNav,
    mainNavMobile: [
        {
            title: "Home",
            href: PathConstants.HOME,
        },
        ...adminNav,
    ],
};
