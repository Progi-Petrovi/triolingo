import { Calendar, momentLocalizer, ToolbarProps, View } from "react-big-calendar";
import { CustomToolbar } from "./CustomToolbar";
import moment from "moment";
import { Lesson, LessonRequest } from "@/types/lesson";
import { CalendarComponent } from "@/types/calendar";
import { Link } from "react-router-dom";
import { ComponentType, useState } from "react";
import "@/calendar.css";

type ReactBigCalendarProps = {
	lessons?: Lesson[];
	lessonRequests?: LessonRequest[];
	componentType: CalendarComponent;
	style?: React.CSSProperties;
};

type Event = {
	title: string;
	teacherProfileUrl: string;
	teacherFullName: string;
	teacherPayment: number;
	status: string;
};

function lessonToEvent(lesson: Lesson): Event {
	return {
		title: lesson.title,
		teacherProfileUrl: `/teacher/${lesson.teacher.id}`,
		teacherFullName: lesson.teacher.fullName,
		teacherPayment: lesson.teacherPayment,
		status: lesson.status.toString(),
	};
}

function lessonRequestToEvent(request: LessonRequest): Event {
	return lessonToEvent(request.lesson);
}

function EventComponent({
	event,
	componentType,
}: {
	event: Event;
	componentType?: CalendarComponent;
}) {
	return (
		<span className={event.status}>
			<strong>{event.title}</strong>
			{componentType === CalendarComponent.STUDENT_COMPONENT && (
				<>
					<br />
					<Link to={event.teacherProfileUrl}>
						{event.teacherFullName}
					</Link>
				</>
			)}
			<br />€{event.teacherPayment}
		</span>
	);
}

export default function ReactBigCalendar({
	lessons = [],
	lessonRequests = [],
	componentType,
	style = {},
}: ReactBigCalendarProps) {
	const localizer = momentLocalizer(moment);

	const getLastView = () => {
		const lastView = sessionStorage.getItem("lastView");
		return lastView ? (lastView as View) : "month";
	};

	const [view, setView] = useState<View>(getLastView());

	const onView = (newView: View) => {
		setView(newView);
		sessionStorage.setItem("lastView", newView);
	};

	return (
		<Calendar
			className={`${view + "-active"}`}
			localizer={localizer}
			defaultDate={new Date()}
			defaultView={getLastView()}
			events={lessons
				.map(lessonToEvent)
				.concat(lessonRequests.map(lessonRequestToEvent))}
			style={{
				height: "70vh",
				flex: 1,
				minHeight: "70vh",
				maxWidth: "95vw",
				...style,
			}}
			components={{
				event: (props) => (
					<EventComponent {...props} componentType={componentType} />
				),
				toolbar: CustomToolbar as ComponentType<
					ToolbarProps<Event, object>
				>,
			}}
			onView={onView}
		/>
	);
}
