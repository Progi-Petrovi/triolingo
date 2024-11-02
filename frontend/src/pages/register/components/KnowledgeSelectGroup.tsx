import { SelectGroup, SelectItem } from "@/components/ui/select";
import { KnowledgeLevel } from "@/types/language-level";

export default function KnowledgeSelectGroup() {
  return (
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
  );
}
