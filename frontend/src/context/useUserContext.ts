import { useContext } from "react";
import UserContext from "./userContext";
import { Student, Teacher, User } from "@/types/users";

export type UserContextType = {
    user: User | Teacher | Student | null;
    fetchUser: () => void;
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
        throw new Error("User is not available yet.");
    }

    return user;
}
