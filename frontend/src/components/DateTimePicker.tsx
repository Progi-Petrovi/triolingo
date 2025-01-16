"use client";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
    const formattedTime = `${value
        .getHours()
        .toString()
        .padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`;

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = event.target.value.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            return;
        }
        const updatedDate = new Date(value);
        updatedDate.setHours(hours);
        updatedDate.setMinutes(minutes);
        onChange(updatedDate); // ✅ Fully controlled state using value prop
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const updatedDate = new Date(selectedDate);
            updatedDate.setHours(value.getHours());
            updatedDate.setMinutes(value.getMinutes());
            onChange(updatedDate); // ✅ Fully controlled state using value prop
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            {/* Date Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-60">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? value.toDateString() : "Pick a date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <Input
                className="w-18"
                type="time"
                value={formattedTime}
                onChange={handleTimeChange}
            />
        </div>
    );
}
