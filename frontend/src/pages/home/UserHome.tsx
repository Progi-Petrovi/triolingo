import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { TeacherTableRow } from "@/types/user-table-row";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserHome() {
    const fetch = useFetch();
    const [teachers, setTeachers] = useState<TeacherTableRow[]>([]);

    useEffect(() => {
        fetch("teacher/all").then((res) => {
            setTeachers(res.body as TeacherTableRow[]);
        });
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
