import {
    Calendar as ReactBigCalendar,
    momentLocalizer,
} from "react-big-calendar";
import moment from "moment";

import "@/calendar.css";

const localizer = momentLocalizer(moment);

export default function Calendar() {
    /* TODO: Fetch lessons from the server */

    const lessons = [
        {
            start: moment("2025-01-10T09:45:00").toDate(),
            end: moment("2025-01-10T10:45:00").toDate(),
            title: "English Lesson #1",
            teacher: "Leonardo Šimunović",
            teacherProfileUrl: "/teacher/1",
        },
        {
            start: moment("2025-01-11T09:45:00").toDate(),
            end: moment("2025-01-11T20:45:00").toDate(),
            title: "German Lesson #1",
            teacher: "Stjepan Bonić",
            teacherProfileUrl: "/teacher/2",
        },
    ];

    function Lesson({ event }: { event: any }) {
        return (
            <span>
                <strong>{event.title}</strong> <br />
                <a href={event.teacherProfileUrl}>{event.teacher}</a>
            </span>
        );
    }

    return (
        <div className="App">
            <ReactBigCalendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={lessons}
                style={{ height: "70vh" }}
                components={{
                    event: Lesson,
                }}
            />
        </div>
    );
}
