import { ComponentType } from "react";
import { Event, ToolbarProps } from "react-big-calendar";
import { Button } from "@/components/ui/button";

export const CustomToolbar: ComponentType<ToolbarProps<Event, object>> = ({
    label,
    onNavigate,
    onView,
}) => {
    const classNames = "text-xs sm:text-sm px-0 sm:px-2 py-0 sm:py-1";

    return (
        <div className="flex flex-col gap-4 py-4 bg-inherit rounded-lg shadow">
            {/* Top Section: Current View and Date Label */}
            <div className="text-center text-xl font-semibold">{label}</div>

            {/* Bottom Section: Navigation and View Controls */}
            <div className="flex justify-between items-center gap-10">
                {/* Navigation Buttons */}
                <div className="flex">
                    <Button onClick={() => onNavigate("PREV")} className={classNames}>
                        ← Previous
                    </Button>
                    <Button onClick={() => onNavigate("TODAY")} className={classNames}>
                        Today
                    </Button>
                    <Button onClick={() => onNavigate("NEXT")} className={classNames}>
                        Next →
                    </Button>
                </div>

                {/* View Buttons */}
                <div className="flex">
                    <Button onClick={() => onView("month")} className={classNames}>
                        Month
                    </Button>
                    <Button onClick={() => onView("week")} className={classNames}>
                        Week
                    </Button>
                    <Button onClick={() => onView("day")} className={classNames}>
                        Day
                    </Button>
                    <Button onClick={() => onView("agenda")} className={classNames}>
                        Agenda
                    </Button>
                </div>
            </div>
        </div>
    );
};
