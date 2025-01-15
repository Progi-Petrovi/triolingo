import {
    Calendar,
    momentLocalizer,
    ToolbarProps,
    View,
} from "react-big-calendar";
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

type EventType = {
    start: Date;
    end: Date;
    title: string;
    teacherProfileUrl: string;
    teacherFullName: string;
    teacherPayment: number;
    status: string;
};

function lessonToEvent(lesson: Lesson): EventType {
    return {
        start: lesson.start,
        end: lesson.end,
        title: lesson.title,
        teacherProfileUrl: `/teacher/${lesson.teacher.id}`,
        teacherFullName: lesson.teacher.fullName,
        teacherPayment: lesson.teacherPayment,
        status: lesson.status,
    };
}

function lessonRequestToEvent(request: LessonRequest): EventType {
    return {
        start: request.lesson.start,
        end: request.lesson.end,
        title: request.lesson.title,
        teacherProfileUrl: `/teacher/${request.lesson.teacher.id}`,
        teacherFullName: request.lesson.teacher.fullName,
        teacherPayment: request.lesson.teacherPayment,
        status: request.status,
    };
}

function EventComponent({
    event,
    componentType,
}: {
    event: EventType;
    componentType?: CalendarComponent;
}) {
    console.log("EventComponent: ", event);
    console.log(event.status);

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
    console.log("RBC lessons: ", lessons);
    console.log("RBC lessonRequests: ", lessonRequests);

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

    const events = lessons
        .map(lessonToEvent)
        .concat(lessonRequests.map(lessonRequestToEvent));

    console.log("RBC events: ", events);

    return (
        <Calendar
            className={`${view + "-active"}`}
            localizer={localizer}
            defaultDate={new Date()}
            defaultView={getLastView()}
            events={events}
            style={{
                height: "70vh",
                flex: 1,
                minHeight: "70vh",
                maxWidth: "95vw",
                ...style,
            }}
            components={{
                event: (event) => (
                    <EventComponent
                        event={event.event as EventType}
                        componentType={componentType}
                    />
                ),
                toolbar: CustomToolbar as ComponentType<
                    ToolbarProps<EventType, object>
                >,
            }}
            onView={onView}
        />
    );
}
