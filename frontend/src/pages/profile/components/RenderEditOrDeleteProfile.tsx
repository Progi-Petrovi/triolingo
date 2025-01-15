import { useToast } from "@/hooks/use-toast";
import { User, Role } from "@/types/users";
import { deleteProfile } from "@/utils/main";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RenderEditDeleteProfile({
    role,
    userProfile,
}: {
    role: Role | null;
    userProfile: User;
}) {
    const navigate = useNavigate();
    const { toast } = useToast();

    if (role !== Role.ROLE_ADMIN) {
        return null;
    }

    const deleteCurrentProfile = () => {
        deleteProfile(userProfile.role, userProfile.id, toast, navigate);
    };

    return (
        <div className="flex gap-5 justify-center items-center">
            <Button>Edit profile</Button>
            <Button onClick={deleteCurrentProfile}>Delete profile</Button>
        </div>
    );
}
