import { useContext } from "react";
import UserContext from "./UserContext";
import { Student, Teacher, User } from "@/types/users";
import { UserNotLoadedError } from "./user-not-loaded";

export type UserContextType = {
    user: User | Teacher | Student | null;
    fetchUser: () => void;
    logoutUser: () => void;
};

export default function useUserContext(): UserContextType {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    return userContext;
}

export function useUser(): User {
    const userContext = useUserContext();

    const { user } = userContext;

    if (!user) {
        throw new UserNotLoadedError();
    }

    return user;
}
