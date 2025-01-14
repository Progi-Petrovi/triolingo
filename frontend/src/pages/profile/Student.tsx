import { Student as StudentType } from "@/types/users";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentProfile from "./StudentProfile";
import { useFetch } from "@/hooks/use-fetch";
import { languageMapToArray } from "@/types/language-level";

export default function Student() {
    const { id } = useParams();
    const fetch = useFetch();
    const [student, setStudent] = useState<StudentType | null>(null);

    useEffect(() => {
        fetch(`student/${id}`)
            .then((res) => {
                if (res.status === 404) {
                    console.error("Student not found");
                    return;
                }

                const learningLanguages = languageMapToArray(
                    res.body.learningLanguages
                );
                setStudent({ ...res.body, learningLanguages } as StudentType);
            })
            .catch((error) => console.error("Error fetching student:", error));
    }, [id]);

    if (!student) {
        return <h1>Loading...</h1>;
    }

    return <StudentProfile user={student} />;
}
