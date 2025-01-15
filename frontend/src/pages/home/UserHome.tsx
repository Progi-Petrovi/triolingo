import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { useWSLessonRequests } from "@/hooks/use-socket";
import { TeacherTableRow } from "@/types/user-table-row";
import { User } from "@/types/users";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserHome() {
    const { user, fetchUser } = useUserContext();
    const fetch = useFetch();
    const [teachers, setTeachers] = useState<TeacherTableRow[]>([]);

    const useRequestsClient = useWSLessonRequests({
        user: user as User,
    });

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
        fetch("teacher/all").then((res) => {
            setTeachers(res.body as TeacherTableRow[]);
        });
        useRequestsClient();
    }, []);

    return (
        <div className="w-[80vw]">
            <Table>
                <TableCaption>Teachers</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Teaching style</TableHead>
                        <TableHead>Years of experience</TableHead>
                        <TableHead className="text-right">
                            Hourly Rate
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                            <TableCell className="font-medium">
                                <Link to={`/teacher/${teacher.id}`}>
                                    {teacher.fullName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {teacher.languages.join(", ")}
                            </TableCell>
                            <TableCell>{teacher.teachingStyle}</TableCell>
                            <TableCell>{teacher.yearsOfExperience}</TableCell>
                            <TableCell className="text-right">
                                €{teacher.hourlyRate}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
