/* eslint-disable react-hooks/rules-of-hooks */
import StudentProfile from "./StudentProfile";
import useUserContext from "@/context/use-user-context";
import TeacherProfile from "./TeacherProfile";
import { Role } from "@/types/users";
import { useEffect } from "react";

export default function Profile() {
    const { user, fetchUser } = useUserContext();

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    if (!user) {
        return <h1>Loading...</h1>;
    }

    const role = user?.role as Role;

    return user.role === Role.ROLE_TEACHER ? (
        <TeacherProfile userProfile={user} profileOwner={true} role={role} />
    ) : (
        <StudentProfile userProfile={user} profileOwner={true} role={role} />
    );
}
