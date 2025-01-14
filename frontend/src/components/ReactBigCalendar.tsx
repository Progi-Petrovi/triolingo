import { Calendar, momentLocalizer, View } from "react-big-calendar";
import { CustomToolbar } from "./CustomToolbar";
import moment from "moment";
import { LessonType as LessonEvent, LessonRequest } from "@/types/lesson";

type ReactBigCalendarProps = {
    lessons?: LessonEvent[];
    lessonRequests?: LessonRequest[];
    eventComponent: ({ event }: { event: LessonEvent }) => JSX.Element;
    setView: any;
    style?: React.CSSProperties;
};

export default function ReactBigCalendar({
    lessons = [],
    lessonRequests = [],
    eventComponent,
    setView,
    style = {},
}: ReactBigCalendarProps) {
    const localizer = momentLocalizer(moment);

    const onView = (newView: View) => {
        setView(newView);
    };

    return (
        <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={lessons.concat(lessonRequests)}
            style={{
                height: "70vh",
                flex: 1,
                minHeight: "70vh",
                maxWidth: "95vw",
                ...style,
            }}
            components={{
                event: eventComponent,
                toolbar: CustomToolbar,
            }}
            onView={onView}
        />
    );
}
