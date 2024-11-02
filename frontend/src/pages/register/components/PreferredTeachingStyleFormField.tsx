import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { PreferredTeachingStyle } from "@/types/teaching-style";

type PreferredTeachingStyleFormField = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
};

export default function PreferredTeachingStyleFormField({
  form,
}: PreferredTeachingStyleFormField) {
  return (
    <FormField
      control={form.control}
      name="preferredTeachingStyle"
      render={({ field }) => (
        <FormItem>
          <FormLabel>* Preffered Teaching Style</FormLabel>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={field.value} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={PreferredTeachingStyle.INDIVIDUAL}>
                  {PreferredTeachingStyle.INDIVIDUAL}
                </SelectItem>
                <SelectItem value={PreferredTeachingStyle.GROUP}>
                  {PreferredTeachingStyle.GROUP}
                </SelectItem>
                <SelectItem value={PreferredTeachingStyle.FLEXIBLE}>
                  {PreferredTeachingStyle.FLEXIBLE}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
