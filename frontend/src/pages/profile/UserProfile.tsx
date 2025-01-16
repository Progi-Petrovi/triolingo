import { useFetch } from "@/hooks/use-fetch";
import { languageMapToArray } from "@/types/language-level";
import { Role, Student, Teacher, User } from "@/types/users";
import { useEffect, useState } from "react";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";
import { useLocation, useParams } from "react-router-dom";
import useUserContext from "@/context/use-user-context";
import { useWSLessonRequests } from "@/hooks/use-socket";

export default function UserProfile() {
    const { user, fetchUser } = useUserContext();
    const role = user?.role as Role;
    const { id } = useParams();
    const location = useLocation();
    const profileRole = location.pathname.includes("teacher")
        ? Role.ROLE_TEACHER
        : Role.ROLE_STUDENT;
    const fetch = useFetch();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [student, setStudent] = useState<Student | null>(null);

    const useRequestsClient = useWSLessonRequests({
        user: user as User,
    });

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        useRequestsClient();
    }, []);

    const endpoint =
        profileRole === Role.ROLE_TEACHER ? `teacher/${id}` : `student/${id}`;

    useEffect(() => {
        fetch(endpoint)
            .then((res) => {
                if (res.status === 404) {
                    console.error(
                        profileRole === Role.ROLE_TEACHER
                            ? "Teacher"
                            : "Student",
                        "not found"
                    );
                    return;
                }

                if (profileRole === Role.ROLE_STUDENT) {
                    const learningLanguages = languageMapToArray(
                        res.body.learningLanguages
                    );
                    setStudent({
                        ...res.body,
                        learningLanguages,
                        role: profileRole,
                    } as Student);
                    return;
                }
                setTeacher({ ...res.body, role: profileRole } as Teacher);
            })
            .catch((error) => console.error("Error fetching teacher:", error));
    }, [id]);

    if (!teacher && !student) {
        return <div>Loading...</div>;
    }

    if (profileRole === Role.ROLE_TEACHER && teacher) {
        return (
            <TeacherProfile
                userProfile={teacher}
                role={role}
                profileOwner={user?.id === teacher.id}
            />
        );
    } else if (profileRole === Role.ROLE_STUDENT && student) {
        return (
            <StudentProfile
                userProfile={student}
                role={role}
                profileOwner={user?.id === student.id}
            />
        );
    }
}
