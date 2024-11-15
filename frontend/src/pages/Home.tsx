import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { TeacherTableRow } from "@/types/teacher-table-row";
import { TeachingStyle } from "@/types/teaching-style";
import { useEffect, useState } from "react";

const placeholderTeachers = [
	{
		id: 1,
		name: "Hrvoje Horvat",
		languages: ["French"],
		teachingStyle: TeachingStyle.INDIVIDUAL,
		yearsOfExperience: 2,
		hourlyRate: 8,
	},
	{
		id: 2,
		name: "Hrvoje Horvat 2",
		languages: ["English"],
		teachingStyle: TeachingStyle.GROUP,
		yearsOfExperience: 2,
		hourlyRate: 9,
	},
	{
		id: 5,
		name: "Ivan Jesenski",
		languages: ["Hindi", "Gibberish"],
		teachingStyle: TeachingStyle.FLEXIBLE,
		yearsOfExperience: 2,
		hourlyRate: 12,
	},
];

export default function Home() {
	const fetchApi = useFetch();
	const [teachers] = useState<TeacherTableRow[]>(placeholderTeachers);

	useEffect(() => {
		//TODO: fetch from database and put actual teachers, map to TeacherTableRow
		fetchApi("/api/teachers");
	}, []);

	return (
		<div className="w-[80vw]">
			<Table>
				<TableCaption>Teachers</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Languages</TableHead>
						<TableHead>Teaching style</TableHead>
						<TableHead>Years of experience</TableHead>
						<TableHead className="text-right">
							Hourly Rate
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teachers.map((teacher) => (
						<TableRow key={teacher.id}>
							<TableCell className="font-medium">
								{teacher.name}
							</TableCell>
							<TableCell>
								{teacher.languages.join(", ")}
							</TableCell>
							<TableCell>
								{teacher.teachingStyle}
							</TableCell>
							<TableCell>
								{teacher.yearsOfExperience}
							</TableCell>
							<TableCell className="text-right">
								${teacher.hourlyRate}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
