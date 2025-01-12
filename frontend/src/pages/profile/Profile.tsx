import StudentProfile from "./StudentProfile";
import { useUser } from "@/context/use-user-context";
import TeacherProfile from "./TeacherProfile";
import { Role } from "@/types/users";

export default function Profile() {
    const user = useUser();

    return user.role === Role.ROLE_TEACHER ? (
        <TeacherProfile />
    ) : (
        <StudentProfile />
    );
}
