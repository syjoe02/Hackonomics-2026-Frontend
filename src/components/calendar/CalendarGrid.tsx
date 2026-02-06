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

// UTC helper
const toUtcDateOnly = (iso: string) =>
    new Date(new Date(iso).toISOString().split("T")[0] + "T00:00:00.000Z");

export default function CalendarGrid({
    currentDate,
    events,
    onEventClick,
}: Props) {
    const getCellDateUtc = (day: number) =>
        new Date(
            Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                day
            )
        );

    const getEventsForDay = (day: number) => {
        const cellDate = getCellDateUtc(day);

        return events.filter(event => {
            const start = toUtcDateOnly(event.start_at);
            const end = toUtcDateOnly(event.end_at);
            return cellDate >= start && cellDate <= end;
        });
    };

    const isEventStartOnThisDay = (event: CalendarEvent, day: number) => {
        const start = toUtcDateOnly(event.start_at);
        const cellDate = getCellDateUtc(day);
        return start.getTime() === cellDate.getTime();
    };

    const isEventEndOnThisDay = (event: CalendarEvent, day: number) => {
        const end = toUtcDateOnly(event.end_at);
        const cellDate = getCellDateUtc(day);
        return end.getTime() === cellDate.getTime();
    };

    const isSingleDayEvent = (event: CalendarEvent) => {
        const start = toUtcDateOnly(event.start_at);
        const end = toUtcDateOnly(event.end_at);
        return start.getTime() === end.getTime();
    };

    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInPrevMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const todayUtc = toUtcDateOnly(new Date().toISOString());

    const cells: ReactNode[] = [];

    // Previous month tail
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

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = getCellDateUtc(day);

        const isToday =
            cellDate.getTime() === todayUtc.getTime();

        const dayEvents = getEventsForDay(day);

        cells.push(
            <div
                key={day}
                className={`min-h-24 p-2 border border-gray-200 hover:bg-gray-50 transition-colors ${isToday
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white"
                    }`}
            >
                <div
                    className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-700"
                        }`}
                >
                    {day}
                </div>

                <div className="space-y-1">
                    {dayEvents.map(event => {
                        const isStart = isEventStartOnThisDay(event, day);
                        const isEnd = isEventEndOnThisDay(event, day);
                        const isSingle = isSingleDayEvent(event);

                        return (
                            <div
                                key={event.id}
                                className={`
                                    text-xs ${event.color ?? "bg-blue-500"}
                                    text-white px-2 py-1 truncate cursor-pointer
                                    ${isStart || isSingle ? "rounded-l-full" : ""}
                                    ${isEnd || isSingle ? "rounded-r-full" : ""}
                                    h-5 flex items-center
                                `}
                                style={{
                                    marginLeft: isStart || isSingle ? "0px" : "-8px",
                                    marginRight: isEnd || isSingle ? "0px" : "-8px",
                                }}
                                onClick={() => onEventClick(event)}
                            >
                                {isStart && event.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Next month tail
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
            <div className="grid grid-cols-7 gap-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
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