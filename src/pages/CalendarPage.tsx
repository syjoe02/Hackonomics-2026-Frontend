import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import Button from "@/components/ui/Button";
import AppBackground from "@/components/layouts/AppBackground";
import { raiseAppError } from "@/common/errors/raiseAppError";
// Not using Left and Right icon without CalendarIcon
import { Calendar as ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/api/types";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventSideEditor from "@/components/calendar/EventSideEditor";
import CategoryModal from "@/components/calendar/CategoryModal";

type Category = {
    id: string;
    name: string;
    color?: string;
};

type EditingEvent = {
    id: string;
    title: string;
    start_at: string;
    end_at: string;
    estimated_cost?: number | null;
};
// UTC month helpers
const utcMonthAnchor = (d: Date) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));

export default function CalendarPage() {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(() => utcMonthAnchor(new Date()));
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const [isSideEditorOpen, setIsSideEditorOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const [editingEvent, setEditingEvent] = useState<EditingEvent | null>(null);

    const [newEvent, setNewEvent] = useState({
        title: "",
        start_at: "",
        end_at: "",
        estimated_cost: "",
    });

    const [newCategory, setNewCategory] = useState({
        name: "",
        color: "#3b82f6",
    });

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await api.get("/calendar/events/");
                setEvents(res.data);
            } catch (err) {
                raiseAppError(err, navigate, "Failed to load calendar events");
            }
        }
        fetchEvents();
    }, [navigate]);

    const openCreateEditor = async () => {
        const start = new Date(new Date().toISOString());
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        setNewEvent({
            title: "",
            start_at: start.toISOString().slice(0, 16),
            end_at: end.toISOString().slice(0, 16),
            estimated_cost: "",
        });

        try {
            const res = await api.get("/calendar/categories/");
            setCategories(res.data);
            setSelectedCategoryIds([]);
            setEditingEvent(null);
            setIsSideEditorOpen(true);
        } catch (err) {
            raiseAppError(err, navigate, "Failed to load categories");
        }
    };

    const submitCreateEvent = async () => {
        try {
            await api.post("/calendar/events/create/", {
                title: newEvent.title,
                category_ids: selectedCategoryIds,
                estimated_cost: newEvent.estimated_cost
                    ? Number(newEvent.estimated_cost)
                    : null,
                start_at: new Date(newEvent.start_at).toISOString(),
                end_at: new Date(newEvent.end_at).toISOString(),
            });

            const res = await api.get("/calendar/events/");
            setEvents(res.data);
            setIsSideEditorOpen(false);
            setEditingEvent(null);
        } catch (err) {
            raiseAppError(err, navigate, "Failed to create event");
        }
    };

    const deleteEvent = async () => {
        if (!editingEvent) return;
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await api.delete(`/calendar/events/${editingEvent.id}/`);

            const res = await api.get("/calendar/events/");
            setEvents(res.data);
            setIsSideEditorOpen(false);
            setEditingEvent(null);
        } catch (err) {
            raiseAppError(err, navigate, "Failed to delete event");
        }
    };

    return (
        <AppBackground>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
                <div className="max-w-7xl mx-auto relative">

                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="flex items-center justify-between mb-8">
                            {/* headers */}
                            <h1 className="text-3xl font-bold text-gray-800">
                                {new Intl.DateTimeFormat("en-US", {
                                    month: "long",
                                    year: "numeric",
                                    timeZone: "UTC",
                                }).format(currentDate)}
                            </h1>

                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={() =>
                                        setCurrentDate(d =>
                                            new Date(Date.UTC(
                                                d.getUTCFullYear(),
                                                d.getUTCMonth() - 1,
                                                1
                                            ))
                                        )
                                    }
                                    size="sm"
                                    variant="outline"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                <Button
                                    onClick={() =>
                                        setCurrentDate(
                                            new Date(
                                                Date.UTC(
                                                    new Date().getUTCFullYear(),
                                                    new Date().getUTCMonth(),
                                                    1
                                                )
                                            )
                                        )
                                    }
                                    size="md"
                                >
                                    Today
                                </Button>

                                <Button
                                    onClick={() =>
                                        setCurrentDate(d =>
                                            new Date(Date.UTC(
                                                d.getUTCFullYear(),
                                                d.getUTCMonth() + 1,
                                                1
                                            ))
                                        )
                                    }
                                    size="sm"
                                    variant="outline"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>

                                <Button onClick={() => setIsCategoryModalOpen(true)} size="md">
                                    Categories
                                </Button>

                                <Button onClick={openCreateEditor} size="md">
                                    New Event
                                </Button>
                            </div>
                        </div>

                        <CalendarGrid
                            currentDate={currentDate}
                            events={events}
                            onEventClick={event => {
                                setEditingEvent(event);
                                setNewEvent({
                                    title: event.title,
                                    start_at: new Date(event.start_at).toISOString().slice(0, 16),
                                    end_at: new Date(event.end_at).toISOString().slice(0, 16),
                                    estimated_cost: event.estimated_cost?.toString() ?? "",
                                });
                                setIsSideEditorOpen(true);
                            }}
                        />
                    </div>

                    <EventSideEditor
                        isOpen={isSideEditorOpen}
                        editingEvent={editingEvent}
                        newEvent={newEvent}
                        categories={categories}
                        selectedCategoryIds={selectedCategoryIds}
                        onChangeEvent={(field, value) =>
                            setNewEvent(prev => ({ ...prev, [field]: value }))
                        }
                        onToggleCategory={id =>
                            setSelectedCategoryIds(prev =>
                                prev.includes(id)
                                    ? prev.filter(x => x !== id)
                                    : [...prev, id]
                            )
                        }
                        onClose={() => {
                            setIsSideEditorOpen(false);
                            setEditingEvent(null);
                        }}
                        onSubmit={submitCreateEvent}
                        onDelete={deleteEvent}
                    />

                    <CategoryModal
                        isOpen={isCategoryModalOpen}
                        categories={categories}
                        newCategory={newCategory}
                        isColorPickerOpen={isColorPickerOpen}
                        onChangeName={v => setNewCategory({ ...newCategory, name: v })}
                        onSelectColor={c => {
                            setNewCategory({ ...newCategory, color: c });
                            setIsColorPickerOpen(false);
                        }}
                        onToggleColorPicker={() => setIsColorPickerOpen(p => !p)}
                        onCreate={async () => {
                            try {
                                await api.post("/calendar/categories/create/", newCategory);
                                const res = await api.get("/calendar/categories/");
                                setCategories(res.data);
                                setNewCategory({ name: "", color: "#3b82f6" });
                            } catch (err) {
                                raiseAppError(err, navigate, "Failed to create category");
                            }
                        }}
                        onDelete={async id => {
                            await api.delete(`/calendar/categories/${id}/`);
                            const res = await api.get("/calendar/categories/");
                            setCategories(res.data);
                        }}
                        onClose={() => setIsCategoryModalOpen(false)}
                    />
                </div>
            </div>
        </AppBackground>
    );
}