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
import ProfilePictureEditor from "./components/ProfilePictureEditor";
import { initials } from "@/utils/main";
import { Student, Teacher, User } from "@/types/users";

export type TeacherProfileType = {
    userProfile: User | Teacher | Student;
    profileOwner?: boolean;
};

export default function TeacherProfile({
    userProfile,
    profileOwner,
}: TeacherProfileType) {
    const teacher = userProfile as Teacher;

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

    function renderProfilePictureEditor() {
        if (!profileOwner) {
            return null;
        }

        return (
            <CardContent>
                <ProfilePictureEditor />
            </CardContent>
        )
    }

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage
                                    src={`images/profile/${teacher.profileImageHash}`}
                                />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(teacher.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {teacher.fullName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <img src={emailIcon} alt="mail" />
                        <p>{teacher.email}</p>
                    </CardContent>
                    <CardContent>Teacher</CardContent>
                    {renderProfilePictureEditor()}
                    {renderChangePasswordDialog()}
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Hourly Rate</CardTitle>
                    </CardHeader>
                    <CardContent>€{teacher.hourlyRate}</CardContent>
                </Card>
                <Card className="max-h-50 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 flex-wrap">
                        {teacher.languages.map((lang) => (
                            <Badge key={lang}>{lang}</Badge>
                        ))}
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
                    <CardContent>
                        {teacher.teachingStyle as TeachingStyle}
                    </CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teacher.qualifications
                            ? teacher.qualifications
                            : "No qualifications."}
                    </CardContent>
                </Card>
                <div className="flex justify-center items-center">
                    <Button>Edit profile</Button>
                </div>
            </div>
        </div>
    );
}
