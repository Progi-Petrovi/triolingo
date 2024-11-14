import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { TeachingStyle } from "@/types/teaching-style";

type TeachingStyleFormField = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: any;
};

export default function TeachingStyleFormField({ form }: TeachingStyleFormField) {
	return (
		<FormField
			control={form.control}
			name="teachingStyle"
			render={({ field }) => (
				<FormItem>
					<FormLabel>* Teaching Style</FormLabel>
					<Select onValueChange={field.onChange}>
						<FormControl>
							<SelectTrigger>
								<SelectValue
									placeholder={field.value}
								/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectGroup>
								<SelectItem
									value={
										TeachingStyle.INDIVIDUAL
									}
								>
									{TeachingStyle.INDIVIDUAL}
								</SelectItem>
								<SelectItem
									value={TeachingStyle.GROUP}
								>
									{TeachingStyle.GROUP}
								</SelectItem>
								<SelectItem
									value={
										TeachingStyle.FLEXIBLE
									}
								>
									{TeachingStyle.FLEXIBLE}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</FormItem>
			)}
		/>
	);
}
