import { api } from "@/api/client";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import AppBackground from "@/components/layouts/AppBackground";
import { raiseAppError } from "@/common/errors/raiseAppError";

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

interface CalendarEvent {
    id: string;
    title: string;
    start_at: string;
    end_at: string;
    color?: string;
}

export default function CalendarPage() {
    const navigate = useNavigate();
    const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    // Events
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start_at: "",
        end_at: "",
    });

    useEffect(() => {
        async function initCalendar() {
            try {
                await api.post("/calendar/init/");
            } catch {
                // non-critical; backend may already be initialized
            }
        }
        initCalendar();
    }, []);

    useEffect(() => {
        async function checkConnectionAndFetch() {
            setLoading(true);

            try {
                // Check if user already has a calendar
                await api.get("/calendar/me/");
                setIsGoogleCalendarConnected(true);

                // Fetch events
                const res = await api.get("/calendar/events/");
                setEvents(res.data);
            } catch (err: unknown) {
                setIsGoogleCalendarConnected(false);
                raiseAppError(err, navigate, "Failed to load calendar");
            } finally {
                setLoading(false);
            }
        }

        checkConnectionAndFetch();
    }, [navigate]);

    const handleGoogleLogin = () => {
        window.location.href = `${API_SERVER_URL}/calendar/oauth/login/`;
    };

    // Calendar helper
    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

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

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0=Sun ... 6=Sat

        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();

        const cells: ReactNode[] = [];

        // Previous month tail days
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
        // Current month days
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
                        {dayEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`text-xs ${event.color ?? "bg-blue-500"
                                    } text-white px-2 py-1 rounded truncate`}
                                title={event.title}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        const totalCells = 42; // 6 weeks × 7 days
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

        return cells;
    };

    const openCreateModal = () => {
        // Default to next hour
        const start = new Date();
        const end = new Date(Date.now() + 60 * 60 * 1000);

        setNewEvent({
            title: "",
            start_at: start.toISOString().slice(0, 16), // for datetime-local input
            end_at: end.toISOString().slice(0, 16),
        });

        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const submitCreateEvent = async () => {
        if (!newEvent.title.trim()) {
            alert("Please enter a title"); // or better: toast
            return;
        }

        try {
            await api.post("/calendar/events/create/", {
                title: newEvent.title,
                start_at: new Date(newEvent.start_at).toISOString(),
                end_at: new Date(newEvent.end_at).toISOString(),
            });

            // Refresh calendar
            const res = await api.get("/calendar/events/");
            setEvents(res.data);

            closeCreateModal();
        } catch (err: unknown) {
            raiseAppError(err, navigate, "Failed to create event");
        }
    };

    return (
        <AppBackground>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
                <div className="max-w-7xl mx-auto relative">
                    {/* Calendar (blurred if not connected) */}
                    <div
                        className={`${!isGoogleCalendarConnected
                            ? "blur-sm pointer-events-none"
                            : ""
                            } transition-all duration-500`}
                    >
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <CalendarIcon
                                        className="text-blue-600"
                                        size={32}
                                    />
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {getMonthName(currentDate)}
                                    </h1>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Button
                                        onClick={previousMonth}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ChevronLeft size={20} />
                                    </Button>

                                    <Button
                                        onClick={() => setCurrentDate(new Date())}
                                        variant="secondary"
                                        size="md"
                                    >
                                        Today
                                    </Button>

                                    <Button
                                        onClick={nextMonth}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ChevronRight size={20} />
                                    </Button>

                                    <Button variant="primary" size="md" onClick={openCreateModal}>
                                        <span>New Event</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 gap-0 mb-2">
                                {[
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                ].map((day) => (
                                    <div
                                        key={day}
                                        className="p-3 text-center font-semibold text-gray-600 bg-gray-100 border border-gray-200"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-0">
                                {loading ? (
                                    <div className="col-span-7 text-center p-8 text-gray-500">
                                        Loading calendar...
                                    </div>
                                ) : (
                                    renderCalendar()
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Events */}
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px]">
                                <h2 className="text-xl font-bold mb-4">Create New Event</h2>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg p-2"
                                            value={newEvent.title}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    title: e.target.value,
                                                })
                                            }
                                            placeholder="Meeting with team"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Start Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full border rounded-lg p-2"
                                            value={newEvent.start_at}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    start_at: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            End Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full border rounded-lg p-2"
                                            value={newEvent.end_at}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    end_at: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="outline" size="sm" onClick={closeCreateModal}>
                                        Cancel
                                    </Button>

                                    <Button variant="primary" size="sm" onClick={submitCreateEvent}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Google Login Overlay */}
                    {!isGoogleCalendarConnected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <CalendarIcon
                                        className="text-white"
                                        size={40}
                                    />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Connect Google Calendar
                                </h2>

                                <p className="text-gray-600 mb-8">
                                    Sign in with your Google account to view and manage your
                                    calendar events
                                </p>

                                <Button
                                    onClick={handleGoogleLogin}
                                    variant="primary"
                                    fullWidth
                                    className="mb-4"
                                >
                                    <span>Sign in with Google</span>
                                </Button>

                                <p className="text-sm text-gray-500">
                                    Your data is secure and we only access your calendar
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppBackground>
    );
}