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
import { Role, Student, Teacher, User } from "@/types/users";
import { initials } from "@/utils/main";
import useUserContext from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PathConstants from "@/routes/pathConstants";

type StudentProfileType = {
    userProfile: User | Teacher | Student;
    profileOwner?: boolean;
};

export default function StudentProfile({
    userProfile,
    profileOwner,
}: StudentProfileType) {
    const { user } = useUserContext();
    const student = userProfile as Student;
    const fetch = useFetch();
    const navigate = useNavigate();
    const { toast } = useToast();

    function deleteProfile() {
        fetch(`/user/${student.id}`, {
            method: "DELETE",
        }).then((res) => {
            if (res.status === 200) {
                toast({
                    title: `Successfully deleted student with id: ${student.id}`,
                });
                navigate(PathConstants.HOME);
            } else {
                toast({
                    title: `Failed to delete student with id: ${student.id}`,
                });
            }
        });
    }

    function renderChangePasswordDialog() {
        if (!profileOwner) {
            return null;
        }

        return (
            <CardContent>
                <ChangePasswordDialog />
            </CardContent>
        );
    }

    function renderDeleteProfileButton() {
        if (!profileOwner && user?.role !== Role.ROLE_ADMIN) {
            return null;
        }

        return <Button onClick={deleteProfile}>Delete profile</Button>;
    }

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
                    {renderChangePasswordDialog()}
                </Card>
                <Card className="max-h-50 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 flex-wrap">
                        {student.learningLanguages?.map(
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
                <div className="flex gap-5 justify-center items-center">
                    <Button>Edit profile</Button>
                    {renderDeleteProfileButton()}
                </div>
            </div>
        </div>
    );
}
