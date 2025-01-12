import { createContext, useState, ReactNode } from "react";
import { useFetch } from "../hooks/use-fetch";
import { Teacher, Role, User, Student } from "@/types/users";
import { UserContextType } from "./useUserContext";

const fetchBasedOnRoles: Record<string, string> = {
    ROLE_TEACHER: "/teacher",
    ROLE_STUDENT: "/student",
    ROLE_ADMIN: "/admin",
};

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: UserProviderProps) {
    const fetch = useFetch();
    const [user, setUser] = useState<User | Teacher | Student | null>(null);

    async function fetchUser() {
        const role = await fetch("/user/role").then(
            (res) => res.body[0].authority
        );

        await fetch(fetchBasedOnRoles[role]).then((res) => {
            if (role === Role.ROLE_TEACHER) {
                setUser({ ...(res.body as Teacher), role } as Teacher);
            } else if (role === Role.ROLE_STUDENT) {
                setUser({ ...(res.body as Student), role } as Student);
            } else if (role === Role.ROLE_ADMIN) {
                setUser({ ...(res.body as User), role } as User);
            }
        });
    }

    return (
        <UserContext.Provider value={{ user, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
