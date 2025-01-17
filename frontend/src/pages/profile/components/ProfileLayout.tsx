/* eslint-disable @typescript-eslint/no-explicit-any */
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
import RenderProfileImageEditor from "./RenderProfileImageEditor.tsx";
import PathConstants from "@/routes/pathConstants.ts";
import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch.ts";
import { useEffect, useState } from "react";

type ProfileLayoutType = {
    userProfile: User | Teacher | Student;
    role: Role;
    profileOwner?: boolean;
    children: JSX.Element;
    editMode: boolean;
    toggleEditMode: () => void;
    form: any;
};

export default function ProfileLayout({
    userProfile,
    role,
    profileOwner = false,
    children,
    editMode,
    toggleEditMode,
    form,
}: ProfileLayoutType) {
    const profileRole = userProfile.role as Role;
    const fetch = useFetch();
    const [hasPreviousLessons, setHasPreviousLessons] =
        useState<boolean>(false);

    const tryFetching = () => {
        fetch(`teacher/${userProfile.id}/email`).then((res) => {
            if (res.status === 200) {
                setHasPreviousLessons(true);
            }
            setHasPreviousLessons(false);
        });
    };

    useEffect(() => {
        if (role === Role.ROLE_STUDENT) {
            tryFetching();
        }
    }, []);

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row md:px-0">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader className="flex flex-col justify-center items-center">
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                {profileRole === Role.ROLE_TEACHER ? (
                                    <AvatarImage
                                        src={`${
                                            PathConstants.API_URL
                                        }/images/profile/${
                                            (userProfile as Teacher)
                                                .profileImageHash
                                        }`}
                                    />
                                ) : (
                                    <AvatarImage />
                                )}
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    {initials(userProfile.fullName)}
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        {editMode ? (
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field}></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <CardDescription className="text-center">
                                {userProfile.fullName}
                            </CardDescription>
                        )}
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
                    <RenderProfileImageEditor profileOwner={profileOwner} />
                    <RenderChangePasswordDialog
                        profileOwner={profileOwner}
                        editMode={editMode}
                    />
                </Card>
                {profileRole === Role.ROLE_TEACHER ? (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Hourly Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {editMode ? (
                                    <FormField
                                        control={form.control}
                                        name="hourlyRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <span>
                                        {(userProfile as Teacher).hourlyRate
                                            ? `€` +
                                              (userProfile as Teacher)
                                                  .hourlyRate
                                            : "Free"}
                                    </span>
                                )}
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
                        {role === Role.ROLE_STUDENT && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lessons</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {hasPreviousLessons && (
                                        <Button
                                            type="button"
                                            className="font-base p-0"
                                        >
                                            <Link
                                                to={`/teacher/prev-lessons/${userProfile.id}`}
                                                className="text-inherit focus:text-inherit hover:text-inherit w-full h-full
                                            flex justify-center items-center text-base"
                                            >
                                                See previous lessons
                                            </Link>
                                        </Button>
                                    )}
                                    <Button type="button" className="font-base">
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
                    editMode={editMode}
                    toggleEditMode={toggleEditMode}
                />
            </div>
        </div>
    );
}
