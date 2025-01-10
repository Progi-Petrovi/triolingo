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
import { KnowledgeLevel } from "@/types/language-level";

export default function StudentProfile() {
    const allLanguages = [
        {
            language: "Croatian",
            knowledgeLevel: KnowledgeLevel.ADVANCED,
        },
        {
            language: "Spanish",
            knowledgeLevel: KnowledgeLevel.BEGINNER,
        },
        {
            language: "French",
            knowledgeLevel: KnowledgeLevel.INTERMEDIATE,
        },
    ];

    return (
        <div className="flex flex-col gap-4 px-4 md:items-start md:gap-20 md:flex-row md:px-0">
            <div className="flex flex-col gap-4 md:w-96">
                <Card className="flex flex-col justify-center items-center">
                    <CardHeader>
                        <CardTitle>
                            <Avatar className="w-32 h-32 cursor-pointer">
                                <AvatarImage src="TODO:get_from_backend" />
                                <AvatarFallback className="text-2xl md:text-4xl">
                                    PP
                                </AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className="text-center">
                            Pero Perić
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <img src={emailIcon} alt="mail" />
                        <p>profile@gmail.com</p>
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
                        {allLanguages.map(({ language, knowledgeLevel }) => (
                            <Badge key={language}>
                                {language} | {knowledgeLevel}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 justify-center w-full md:w-96">
                <Card>
                    <CardHeader>
                        <CardTitle>Preferred teaching style</CardTitle>
                    </CardHeader>
                    <CardContent>{TeachingStyle.FLEXIBLE}</CardContent>
                </Card>
                <Card className="md:w-96 max-h-60 overflow-scroll">
                    <CardHeader>
                        <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Commodi nam placeat, repellendus exercitationem
                        sit assumenda impedit esse illum itaque quam, magni,
                        voluptates delectus ipsam nemo?
                    </CardContent>
                </Card>
                <div className="flex justify-center items-center">
                    <Button>Edit profile</Button>
                </div>
            </div>
        </div>
    );
}
