import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { useFetch } from "../hooks/use-fetch";
import { Teacher, Role } from "@/types/user-types";

const fetchBasedOnRoles: Record<string, string> = {
    ROLE_TEACHER: "/teacher",
    ROLE_STUDENT: "/student",
    ROLE_ADMIN: "/admin",
};

type User = null | { [key: string]: any };

interface UserContextType {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    fetchUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const fetch = useFetch();
    const [user, setUser] = useState<User>(null);

    async function fetchUser() {
        const role = await fetch("/user/role").then(
            (res) => res.body[0].authority
        );

        await fetch(fetchBasedOnRoles[role]).then((res) => {
            if (role === Role.ROLE_TEACHER) {
                setUser({ ...(res.body as Teacher), role });
            }
        });
    }

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
