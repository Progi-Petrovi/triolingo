import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Teacher as TeacherType } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { initials } from "@/utils/main";

export default function Teacher() {
    const fetch = useFetch();
    const { id } = useParams();
    const [teacher, setTeacher] = useState<TeacherType>();

    useEffect(() => {
        fetch(`teacher/${id}`).then((res) => {
            setTeacher(res.body as TeacherType);
        });
    }, [fetch, id]);

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage src="/*TODO*/:get_from_backend" />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(teacher.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {teacher.fullName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>Teacher</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Hourly Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.hourlyRate ? "€" + teacher.hourlyRate : "free"}
                    </CardContent>
                </Card>
                <Card className="max-h-50 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 flex-wrap">
                        {teacher.languages.length
                            ? teacher.languages.map((lang) => (
                                  <Badge key={lang}>{lang}</Badge>
                              ))
                            : "No languages"}
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 justify-center w-full md:w-96">
                <Card>
                    <CardHeader>
                        <CardTitle>Years of experience</CardTitle>
                    </CardHeader>
                    <CardContent>{teacher.yearsOfExperience}</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>{teacher.teachingStyle}</CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.qualifications || "No qualifications"}
                    </CardContent>
                </Card>
                <div className="flex justify-center items-center">
                    <Button>Rate teacher</Button>
                </div>
            </div>
        </div>
    );
}
