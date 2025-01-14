import { userNavConfig, guestNavConfig, NavConfig } from "@/config/header-nav";
import { User } from "@/types/users";

export function initials(fullName: string): string {
    return fullName
        .split(" ")
        .map((name) => name[0])
        .join("");
}

export function renderHeader(user: User | null | undefined): NavConfig {
    return user ? userNavConfig : guestNavConfig;
}
