import { Dispatch, SetStateAction, useContext } from "react";
import UserContext from "./UserContext";
import { Student, Teacher, User } from "@/types/users";

export type UserContextType = {
    user: User | Teacher | Student | null;
    setUser: Dispatch<SetStateAction<User | Teacher | Student | null>>;
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
