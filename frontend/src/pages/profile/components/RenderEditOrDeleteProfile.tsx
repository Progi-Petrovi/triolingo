import { useToast } from "@/hooks/use-toast";
import { User, Role } from "@/types/users";
import { deleteProfile } from "@/utils/main";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type RenderEditDeleteProfileType = {
    role: Role | null;
    userProfile: User;
    profileOwner?: boolean;
    editMode: boolean;
    toggleEditMode: () => void;
};

export default function RenderEditDeleteProfile({
    role,
    userProfile,
    profileOwner,
    editMode,
    toggleEditMode,
}: RenderEditDeleteProfileType) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const deleteCurrentProfile = () => {
        deleteProfile(userProfile.role, userProfile.id, toast, navigate);
    };

    if (!profileOwner && role !== Role.ROLE_ADMIN) {
        return null;
    }

    if (editMode) {
        return null;
    }

    return (
        <div className="flex gap-5 justify-center items-center">
            <Button type="button" onClick={toggleEditMode}>
                Edit profile
            </Button>
            <Button type="button" onClick={deleteCurrentProfile}>
                Delete profile
            </Button>
        </div>
    );
}
