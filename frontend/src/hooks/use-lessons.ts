import {
	LessonRequest,
	LessonRequestStatus,
	Lesson,
	LessonBulkAggregate,
	LessonRequestBulkAggregate,
} from "@/types/lesson";
import {
	lessonBulkAggregateToLessons,
	lessonRequestBulkAggregateToLessonRequests,
} from "@/utils/main";
import { useFetch } from "./use-fetch";
import { useState } from "react";

export function useLoadTeacherLessons(id?: string) {
	const fetch = useFetch();
	const [lessons, setLessons] = useState<Lesson[]>([]);

	const updateLessons = () => {
		fetch("lesson/teacher" + (id ? `/${id}` : ""))
			.then(async (res) => {
				if (res.status === 404) {
					console.error("Lessons not found");
					return;
				}
				const lessonAggregate = res.body as LessonBulkAggregate;
				setLessons(await lessonBulkAggregateToLessons(lessonAggregate));
			})
			.catch((error) => console.error("Error fetching lessons:", error));
	};

	return [lessons, updateLessons] as const;
}

export function useLoadTeacherRequests() {
	const fetch = useFetch();
	const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);

	const getTeacherLessonRequests = () => {
		fetch("lesson/requests/teacher")
			.then(async (res) => {
				if (res.status === 404) {
					console.error("Lessons not found");
					return;
				}

				const requestAggregate = res.body as LessonRequestBulkAggregate;
				setLessonRequests(
					(
						await lessonRequestBulkAggregateToLessonRequests(
							requestAggregate
						)
					).filter(
						(lessonRequest) =>
							lessonRequest.status ===
							LessonRequestStatus.PENDING
					)
				);
			})
			.catch((error) => console.error("Error fetching lesson requests:", error));
	};

	return [lessonRequests, getTeacherLessonRequests] as const;
}

export function useLoadStudentRequests() {
	const fetch = useFetch();
	const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);

	const loadStudentRequests = async () => {
		try {
			const res = await fetch(`lesson/requests/student`);

			if (res.status === 404) {
				console.error("Lessons not found");
				return;
			}
			const requestAggregate = res.body as LessonRequestBulkAggregate;
			console.log("lessonRequests", requestAggregate);
			setLessonRequests(
				await lessonRequestBulkAggregateToLessonRequests(requestAggregate)
			);
		} catch (error) {
			console.error("Error fetching lessons:", error);
		}
	};

	return [lessonRequests, loadStudentRequests] as const;
}
