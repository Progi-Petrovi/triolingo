import {
    userNavConfig,
    guestNavConfig,
    NavConfig,
    adminNavConfig,
    studentNavConfig,
    teacherNavConfig,
} from "@/config/header-nav";
import { Role, User } from "@/types/users";

export function initials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name[0])
        .join("");
}

export function renderHeader(user: User | null): NavConfig {
    if (!user) {
        return guestNavConfig;
    }
    if (user.role === Role.ROLE_ADMIN) {
        return adminNavConfig;
    }
    if (user.role === Role.ROLE_STUDENT) {
        return studentNavConfig;
    }

    return teacherNavConfig;
}
