import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { KnowledgeLevel } from "@/types/language-level";

type KnowledgeSelectType = {
    onValueChange: (val: KnowledgeLevel) => void;
    placeholder: string;
};

export default function KnowledgeSelect({
    onValueChange,
    placeholder,
}: KnowledgeSelectType) {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={KnowledgeLevel.BEGINNER}>
                        {KnowledgeLevel.BEGINNER}
                    </SelectItem>
                    <SelectItem value={KnowledgeLevel.INTERMEDIATE}>
                        {KnowledgeLevel.INTERMEDIATE}
                    </SelectItem>
                    <SelectItem value={KnowledgeLevel.ADVANCED}>
                        {KnowledgeLevel.ADVANCED}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
