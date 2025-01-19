import { CardContent } from "@/components/ui/card.tsx";
import ProfileImageEditor from "@/pages/profile/components/ProfileImageEditor.tsx";

export default function renderProfileImageEditor({
    profileOwner,
}: {
    profileOwner: boolean | undefined;
}) {
    if (!profileOwner) {
        return null;
    }

    return (
        <CardContent className="pt-2">
            <ProfileImageEditor />
        </CardContent>
    );
}
