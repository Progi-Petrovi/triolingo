import StudentProfile from "./StudentProfile";
import useUserContext from "@/context/useUserContext";
import TeacherProfile from "./TeacherProfile";

export default function Profile() {
    const { user } = useUserContext();

    return user.role === "ROLE_TEACHER" ? (
        <TeacherProfile />
    ) : (
        <StudentProfile />
    );
}
