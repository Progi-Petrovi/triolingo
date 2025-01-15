import { Calendar, momentLocalizer, View } from "react-big-calendar";
import { CustomToolbar } from "./CustomToolbar";
import moment from "moment";
import { LessonType, LessonRequest } from "@/types/lesson";
import { CalendarComponent } from "@/types/calendar";
import { Link } from "react-router-dom";
import { useState } from "react";
import "@/calendar.css";

type ReactBigCalendarProps = {
    lessons?: LessonType[];
    lessonRequests?: LessonRequest[];
    componentType: CalendarComponent;
    style?: React.CSSProperties;
};

function EventComponent({
    event,
    componentType,
}: {
    event: LessonType | LessonRequest;
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
            events={lessons.concat(lessonRequests)}
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
                toolbar: CustomToolbar,
            }}
            onView={onView}
        />
    );
}
