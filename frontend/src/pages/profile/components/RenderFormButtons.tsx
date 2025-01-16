import { Button } from "@/components/ui/button";

type RenderFormButtonsType = {
    toggleEditMode: () => void;
};

export default function RenderFormButtons({
    toggleEditMode,
}: RenderFormButtonsType) {
    return (
        <div className="flex space-x-4 justify-center items-center">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={toggleEditMode}>
                Cancel
            </Button>
        </div>
    );
}
