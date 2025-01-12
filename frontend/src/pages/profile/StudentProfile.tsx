import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import emailIcon from "../../icons/email-outline.svg";
import { Badge } from "@/components/ui/badge";
import { TeachingStyle } from "@/types/teaching-style";
import { Button } from "@/components/ui/button";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import { useUser } from "@/context/use-user-context";
import { Student } from "@/types/users";
import { initials } from "@/utils/main";

export default function StudentProfile() {
    const student = useUser() as Student;

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row md:px-0">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage src="TODO:get_from_backend" />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(student.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {student.fullName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <img src={emailIcon} alt="mail" />
                        <p>{student.email}</p>
                    </CardContent>
                    <CardContent>Student</CardContent>
                    <CardContent>
                        <ChangePasswordDialog />
                    </CardContent>
                </Card>
                <Card className="max-h-50 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 flex-wrap">
                        {student.learningLanguages.map(
                            ({ language, level }) => (
                                <Badge key={language}>
                                    {language} | {level}
                                </Badge>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 justify-center w-full md:w-96">
                <Card>
                    <CardHeader>
                        <CardTitle>Preferred teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {student.preferredTeachingStyle as TeachingStyle}
                    </CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {student.learningGoals
                            ? student.learningGoals
                            : "No learning goals."}
                    </CardContent>
                </Card>
                <div className="flex justify-center items-center">
                    <Button>Edit profile</Button>
                </div>
            </div>
        </div>
    );
}
