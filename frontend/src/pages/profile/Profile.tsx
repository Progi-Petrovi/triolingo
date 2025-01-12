import StudentProfile from "./StudentProfile";
import { useUser } from "@/context/use-user-context";
import TeacherProfile from "./TeacherProfile";

export default function Profile() {
    const user = useUser();

    return user.role === "ROLE_TEACHER" ? (
        <TeacherProfile />
    ) : (
        <StudentProfile />
    );
}
