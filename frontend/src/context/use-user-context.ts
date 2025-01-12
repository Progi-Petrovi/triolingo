import { Dispatch, SetStateAction, useContext } from "react";
import UserContext from "./UserContext";
import { Student, Teacher, User, UserStorage } from "@/types/users";
import { UserNotLoadedError } from "./user-not-loaded";

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

export function useUser(): User {
    const userContext = useUserContext();

    const { user, setUser } = userContext;

    if (!user) {
        const userFromStorage = sessionStorage.getItem(
            UserStorage.TRIOLINGO_USER
        );
        if (!userFromStorage) {
            throw new UserNotLoadedError();
        }
        setUser(JSON.parse(userFromStorage) as User);
        return JSON.parse(userFromStorage) as User;
    }

    return user;
}
