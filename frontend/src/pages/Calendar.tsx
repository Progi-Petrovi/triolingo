import {
    Calendar as ReactBigCalendar,
    View,
    momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import { LessonType as LessonEvent } from "@/types/lesson-event";

import "@/calendar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

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

    function Lesson({ event }: { event: LessonEvent }) {
        return (
            <span>
                <strong>{event.title}</strong> <br />
                <Link to={event.teacherProfileUrl}>{event.teacher}</Link>
            </span>
        );
    }

    const [view, setView] = useState("month");

    const handleViewChange = (newView: View) => {
        setView(newView);
    };

    return (
        <div
            className={`App ${view === "week" ? "week-active" : ""} ${
                view === "day" ? "day-active" : ""
            }`}
        >
            <ReactBigCalendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={lessons}
                style={{ height: "70vh" }}
                components={{
                    event: Lesson,
                }}
                onView={(newView) => handleViewChange(newView)}
            />
        </div>
    );
}
