import { useContext } from "react";
import UserContext from "./userContext";

export default function useUserContext() {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    return userContext;
}
