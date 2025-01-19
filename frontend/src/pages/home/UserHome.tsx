/* eslint-disable react-hooks/rules-of-hooks */
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
import { TeacherTableRow } from "@/types/user-table-row";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilteringForm from "./TeacherFilteringForm";

export default function UserHome() {
    const { user, fetchUser } = useUserContext();
    const fetch = useFetch();
    const [teachers, setTeachers] = useState<TeacherTableRow[]>([]);
    const [allLanguages, setAllLanguages] = useState<string[]>([]);

    useEffect(() => {
        if (!user) {
            fetchUser(true);
        }
        fetch("teacher/all").then((res) => {
            setTeachers(res.body as TeacherTableRow[]);
        });
        fetch("language").then((res) => {
            setAllLanguages(res.body);
        });
    }, []);

    return (
        <div className="w-[80vw]">
            {/* Filter Form */}
            <FilteringForm setTeachers={setTeachers} allLanguages={allLanguages} />

            {/* Teachers Table */}
            {teachers && teachers.length > 0 ? (
                <Table>
                    <TableCaption>Teachers</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Languages</TableHead>
                            <TableHead>Teaching style</TableHead>
                            <TableHead>Years of experience</TableHead>
                            <TableHead className="text-right">Hourly Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">
                                    <Link to={`/teacher/${teacher.id}`}>{teacher.fullName}</Link>
                                </TableCell>
                                <TableCell>{teacher.languages.join(", ")}</TableCell>
                                <TableCell>{teacher.teachingStyle}</TableCell>
                                <TableCell>{teacher.yearsOfExperience}</TableCell>
                                <TableCell className="text-right">€{teacher.hourlyRate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <h1>No teachers found</h1>
            )}
        </div>
    );
}
