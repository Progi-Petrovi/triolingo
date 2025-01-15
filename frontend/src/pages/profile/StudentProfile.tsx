import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachingStyle } from "@/types/teaching-style";
import { ProfileProps } from "@/types/profile";
import { Student } from "@/types/users";
import ProfileLayout from "./components/ProfileLayout";

export default function StudentProfile({
    userProfile,
    role,
    profileOwner,
}: ProfileProps) {
    const student = userProfile as Student;

    function StudentRight() {
        return (
            <>
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
            </>
        );
    }

    return (
        <ProfileLayout
            userProfile={userProfile}
            profileOwner={profileOwner}
            role={role}
        >
            <StudentRight />
        </ProfileLayout>
    );
}
