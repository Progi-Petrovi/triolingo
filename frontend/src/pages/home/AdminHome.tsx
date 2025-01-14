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
import { UserTableRowForAdmin } from "@/types/user-table-row";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminHome() {
    const fetch = useFetch();
    const [teachers, setTeachers] = useState<UserTableRowForAdmin[]>([]);
    const [students, setStudents] = useState<UserTableRowForAdmin[]>([]);

    useEffect(() => {
        fetch("teacher/all")
            .then((res) => {
                setTeachers(res.body as UserTableRowForAdmin[]);
            })
            .catch((e) => console.log("ERROR: " + e));

        fetch("student/all")
            .then((res) => {
                setStudents(res.body as UserTableRowForAdmin[]);
            })
            .catch((e) => console.log("ERROR: " + e));
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-[70vw] gap-20">
            <h1 className="text-center">Admin home</h1>
            <div className="flex flex-col md:flex-row md:justify-around md:items-start w-[70vw]">
                <div className="max-w-fit">
                    <Table>
                        <TableCaption>Teachers</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>{teacher.id}</TableCell>
                                    <TableCell className="font-medium">
                                        <Link to={`/teacher/${teacher.id}`}>
                                            {teacher.fullName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="max-w-fit">
                    <Table>
                        <TableCaption>Students</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.id}</TableCell>
                                    <TableCell className="font-medium">
                                        <Link to={`/student/${student.id}`}>
                                            {student.fullName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{student.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
