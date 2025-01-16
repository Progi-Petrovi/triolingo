import { CardContent } from "@/components/ui/card";
import ChangePasswordDialog from "./ChangePasswordDialog";

type RenderChangePasswordDialogType = {
    profileOwner?: boolean;
    editMode: boolean;
};

export default function RenderChangePasswordDialog({
    profileOwner,
    editMode,
}: RenderChangePasswordDialogType) {
    if (!profileOwner || editMode) {
        return null;
    }

    return (
        <CardContent>
            <ChangePasswordDialog />
        </CardContent>
    );
}
