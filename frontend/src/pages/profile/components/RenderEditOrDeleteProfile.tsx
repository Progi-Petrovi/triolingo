import { useToast } from "@/hooks/use-toast";
import { User, Role } from "@/types/users";
import { deleteProfile } from "@/utils/main";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useUserContext from "@/context/use-user-context";

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
    const { logoutUser } = useUserContext();

    const deleteCurrentProfile = () => {
        deleteProfile(
            userProfile.role,
            userProfile.id,
            toast,
            navigate,
            logoutUser,
            profileOwner
        );
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
            <AlertDialog>
                <AlertDialogTrigger className="ou">
                    Delete profile
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this account and remove the data from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteCurrentProfile}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
