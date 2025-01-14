import useUserContext from "@/context/use-user-context";
import { Role } from "@/types/users";
import AdminHome from "./AdminHome";
import UserHome from "./UserHome";

export default function Home() {
    const { user } = useUserContext();

    function userIsntAdmin() {
        return !user || user.role !== Role.ROLE_ADMIN;
    }

    return userIsntAdmin() ? <UserHome /> : <AdminHome />;
}
