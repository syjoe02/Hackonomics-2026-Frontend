import Button from "@/components/ui/Button";

type Category = {
    id: string;
    name: string;
    color?: string;
};

type Props = {
    isOpen: boolean;
    editingEvent: any | null;
    newEvent: {
        title: string;
        start_at: string;
        end_at: string;
        estimated_cost: string;
    };
    categories: Category[];
    selectedCategoryIds: string[];
    onChangeEvent: (field: string, value: string) => void;
    onToggleCategory: (id: string) => void;
    onClose: () => void;
    onSubmit: () => void;
};

export default function EventSideEditor({
    isOpen,
    editingEvent,
    newEvent,
    categories,
    selectedCategoryIds,
    onChangeEvent,
    onToggleCategory,
    onClose,
    onSubmit,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl p-6 z-50">
            <h2 className="text-xl font-bold mb-4">
                {editingEvent ? "Edit Event" : "New Event"}
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={newEvent.title}
                        onChange={e => onChangeEvent("title", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => {
                            const isSelected = selectedCategoryIds.includes(cat.id);

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onToggleCategory(cat.id)}
                                    className="px-3 py-1 rounded-full text-xs border"
                                    style={{
                                        backgroundColor: isSelected ? cat.color : "white",
                                        borderColor: cat.color,
                                        color: isSelected ? "white" : cat.color,
                                    }}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Estimated Cost
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border rounded-lg p-2"
                        value={newEvent.estimated_cost}
                        onChange={e =>
                            onChangeEvent("estimated_cost", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        className="w-full border rounded-lg p-2"
                        value={newEvent.start_at}
                        onChange={e => onChangeEvent("start_at", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        className="w-full border rounded-lg p-2"
                        value={newEvent.end_at}
                        onChange={e => onChangeEvent("end_at", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" size="sm" onClick={onClose}>
                    Close
                </Button>

                <Button variant="primary" size="sm" onClick={onSubmit}>
                    {editingEvent ? "Save Changes" : "Create"}
                </Button>
            </div>
        </div>
    );
}