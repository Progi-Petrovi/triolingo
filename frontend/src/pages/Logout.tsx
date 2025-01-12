import useUserContext from "@/context/use-user-context";
import { useEffect } from "react";

export default function Logout() {
    const { logoutUser } = useUserContext();

    useEffect(() => {
        logoutUser();
    }, []);

    return <h1>Logging out...</h1>;
}
