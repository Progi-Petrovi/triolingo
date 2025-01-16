import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import emailIcon from "@/icons/email-outline.svg";
import { initials } from "@/utils/main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RenderChangePasswordDialog from "./RenderChangePasswordDialog";
import { Role, Student, Teacher, User } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RenderEditDeleteProfile from "./RenderEditOrDeleteProfile";

export default function ProfileLayout({
    userProfile,
    role,
    profileOwner = false,
    children,
}: {
    userProfile: User | Teacher | Student;
    role: Role;
    profileOwner?: boolean;
    children: JSX.Element;
}) {
    const profileRole = userProfile.role as Role;

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row md:px-0">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage src="TODO:get_from_backend" />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(userProfile.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            {userProfile.fullName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <img src={emailIcon} alt="mail" />
                        <p>{userProfile.email}</p>
                    </CardContent>
                    <CardContent>
                        {profileRole === Role.ROLE_TEACHER
                            ? "Teacher"
                            : "Student"}
                    </CardContent>
                    <RenderChangePasswordDialog profileOwner={profileOwner} />
                </Card>
                {profileRole === Role.ROLE_TEACHER ? (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Hourly Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                €{(userProfile as Teacher).hourlyRate}
                            </CardContent>
                        </Card>
                        <Card className="max-h-50 overflow-scroll">
                            <CardHeader>
                                <CardTitle>Languages</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-2 flex-wrap">
                                {(userProfile as Teacher).languages.map(
                                    (lang) => (
                                        <Badge key={lang}>{lang}</Badge>
                                    )
                                )}
                            </CardContent>
                        </Card>
                        {role !== Role.ROLE_TEACHER && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lessons</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Button className="font-base">
                                        See previous lessons
                                    </Button>
                                    <Button className="font-base">
                                        <Link
                                            to={`/teacher/lessons/${userProfile.id}`}
                                            className="text-inherit focus:text-inherit hover:text-inherit w-full h-full
                                            flex justify-center items-center text-base"
                                        >
                                            Book a lesson
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </>
                ) : (
                    <Card className="max-h-50 overflow-scroll">
                        <CardHeader>
                            <CardTitle>Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2 flex-wrap">
                            {(userProfile as Student).learningLanguages?.map(
                                ({ language, level }) => (
                                    <Badge key={language}>
                                        {language} | {level}
                                    </Badge>
                                )
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex flex-col gap-4 justify-center w-full md:w-96">
                {children}
                <RenderEditDeleteProfile
                    role={role}
                    userProfile={userProfile}
                    profileOwner={profileOwner}
                />
            </div>
        </div>
    );
}
