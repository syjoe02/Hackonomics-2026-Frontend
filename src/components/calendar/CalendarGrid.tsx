import type { ReactNode } from "react";

export interface CalendarEvent {
    id: string;
    title: string;
    start_at: string;
    end_at: string;
    color?: string;
}

type Props = {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
};

export default function CalendarGrid({
    currentDate,
    events,
    onEventClick,
}: Props) {
    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = new Date(event.start_at);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    const cells: ReactNode[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        const dayNumber = daysInPrevMonth - i;
        cells.push(
            <div
                key={`prev-${dayNumber}`}
                className="min-h-24 p-2 border border-gray-200 bg-gray-50"
            >
                <div className="text-sm font-semibold mb-1 text-gray-400">
                    {dayNumber}
                </div>
            </div>
        );
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        const dayEvents = getEventsForDay(day);

        cells.push(
            <div
                key={day}
                className={`min-h-24 p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${isToday ? "bg-blue-50 border-blue-300" : "bg-white"
                    }`}
            >
                <div
                    className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-700"
                        }`}
                >
                    {day}
                </div>

                <div className="space-y-1">
                    {dayEvents.map(event => (
                        <div
                            key={event.id}
                            className={`text-xs ${event.color ?? "bg-blue-500"
                                } text-white px-2 py-1 rounded truncate cursor-pointer`}
                            title={event.title}
                            onClick={() => onEventClick(event)}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const totalCells = 42;
    const remainingCells = totalCells - cells.length;

    for (let i = 1; i <= remainingCells; i++) {
        cells.push(
            <div
                key={`next-${i}`}
                className="min-h-24 p-2 border border-gray-200 bg-gray-50"
            >
                <div className="text-sm font-semibold mb-1 text-gray-400">
                    {i}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* WEEKDAY HEADER */}
            <div className="grid grid-cols-7 gap-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                        key={day}
                        className="p-2 min-h-[52px] text-center font-semibold text-gray-600 bg-gray-100 border border-gray-200"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0">{cells}</div>
        </>
    );
}