import { CardContent } from "@/components/ui/card";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function renderChangePasswordDialog({
    profileOwner,
}: {
    profileOwner: boolean | undefined;
}) {
    if (!profileOwner) {
        return null;
    }

    return (
        <CardContent>
            <ChangePasswordDialog />
        </CardContent>
    );
}
