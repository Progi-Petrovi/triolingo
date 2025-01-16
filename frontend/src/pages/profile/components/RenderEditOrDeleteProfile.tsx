import { useToast } from "@/hooks/use-toast";
import { User, Role } from "@/types/users";
import { deleteProfile } from "@/utils/main";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type RenderEditDeleteProfileType = {
    role: Role | null;
    userProfile: User;
    profileOwner?: boolean;
};

export default function RenderEditDeleteProfile({
    role,
    userProfile,
    profileOwner,
}: RenderEditDeleteProfileType) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const deleteCurrentProfile = () => {
        deleteProfile(userProfile.role, userProfile.id, toast, navigate);
    };

    return (
        <div className="flex gap-5 justify-center items-center">
            {profileOwner && <Button>Edit profile</Button>}
            {role === Role.ROLE_ADMIN && (
                <Button onClick={deleteCurrentProfile}>Delete profile</Button>
            )}
        </div>
    );
}
