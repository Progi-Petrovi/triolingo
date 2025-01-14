import { createContext, useState, ReactNode } from "react";
import { useFetch } from "../hooks/use-fetch";
import { Teacher, Role, User, Student } from "@/types/users";
import { UserContextType } from "./use-user-context";
import { useNavigate } from "react-router-dom";
import PathConstants from "@/routes/pathConstants";
import { languageMapToArray } from "@/types/language-level";
import { useToast } from "@/hooks/use-toast";

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
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<User | Teacher | Student | null>(null);

    async function fetchUser(isInitialFetch?: boolean) {
        const role = await fetch("/user/role")
            .then((res) => res.body[0].authority)
            .catch(() => {
                if (!isInitialFetch) {
                    onFetchUserError();
                }
            });

        await fetch(fetchBasedOnRoles[role])
            .then((res) => {
                if (role === Role.ROLE_TEACHER) {
                    const teacher = {
                        ...(res.body as Teacher),
                        role,
                    } as Teacher;

                    setUser(teacher);
                } else if (role === Role.ROLE_STUDENT) {
                    const learningLanguages = languageMapToArray(
                        res.body.learningLanguages
                    );

                    const student = {
                        ...(res.body as Student),
                        role,
                        learningLanguages,
                    } as Student;

                    setUser(student);
                } else if (role === Role.ROLE_ADMIN) {
                    const admin = { ...(res.body as User), role } as User;

                    setUser(admin);
                }
            })
            .catch(() => {
                if (!isInitialFetch) {
                    onFetchUserError();
                }
            });
    }

    async function logoutUser() {
        await fetch("/user/logout").then((res) => {
            if (res.status === 200 || res.status === 403) {
                setUser(null);
                navigate(PathConstants.HOME);
            }
        });
    }

    function onFetchUserError() {
        navigate(PathConstants.LOGIN);
        toast({
            title: "Please login before accessing that page.",
            variant: "destructive",
        });
    }

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
