import Button from "@/components/ui/Button";
import { CATEGORY_COLORS } from "@/constants/calendar";

type Category = {
    id: string;
    name: string;
    color?: string;
};

type Props = {
    isOpen: boolean;
    categories: Category[];
    newCategory: { name: string; color: string };
    isColorPickerOpen: boolean;
    onChangeName: (v: string) => void;
    onSelectColor: (c: string) => void;
    onToggleColorPicker: () => void;
    onCreate: () => void;
    onDelete: (id: string) => void;
    onClose: () => void;
};

export default function CategoryModal({
    isOpen,
    categories,
    newCategory,
    isColorPickerOpen,
    onChangeName,
    onSelectColor,
    onToggleColorPicker,
    onCreate,
    onDelete,
    onClose,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px]">
                <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={newCategory.name}
                        onChange={e => onChangeName(e.target.value)}
                        placeholder="New category"
                    />
                    <button
                        type="button"
                        onClick={onToggleColorPicker}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center"
                        style={{ backgroundColor: newCategory.color }}
                    >
                        <span className="text-white text-xs">▼</span>
                    </button>
                </div>

                {isColorPickerOpen && (
                    <div className="flex gap-2 flex-wrap p-2 border rounded-lg bg-white shadow-sm">
                        {CATEGORY_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => onSelectColor(c)}
                                className={`
                  w-7 h-7 rounded-full border-2
                  ${newCategory.color === c ? "border-black" : "border-transparent"}
                `}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto mt-4">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className="flex items-center justify-between p-2 border rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <span>{cat.name}</span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(cat.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="primary" size="sm" onClick={onCreate}>
                        Add
                    </Button>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}