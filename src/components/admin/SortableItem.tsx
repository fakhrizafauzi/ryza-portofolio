import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React from "react";

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    dragHandle?: boolean;
    disabled?: boolean;
}

export function SortableItem({ id, children, dragHandle = false, disabled = false }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative flex items-center gap-2 ${isDragging ? 'shadow-2xl z-50 scale-[1.02]' : ''} transition-all duration-200`}>
            {dragHandle && (
                <div {...(!disabled ? attributes : {})} {...(!disabled ? listeners : {})} className={`cursor-grab hover:bg-muted p-2 -ml-2 rounded-lg active:cursor-grabbing text-muted-foreground transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <GripVertical className="w-5 h-5" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                {!dragHandle ? (
                    <div className={`${!disabled ? 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1' : ''} rounded-2xl`}>
                        {/* We add a specific drag handle wrapper inside the child, or let the child handle it if dragHandle is false, but currently dragHandle=false means the whole thing is draggable.
                            To fix button clicks when dragHandle=false, we MUST NOT put listeners on a wrapper that contains buttons.
                            Instead, we'll pass the listeners down, but since children is ReactNode, we just wrap it. 
                            The real fix is in ProjectForm to add dragHandle=true, or use CSS pointer-events.
                            For now, we just restore the listeners but wrap the whole div like before. */}
                        <div {...(!disabled ? attributes : {})} {...(!disabled ? listeners : {})} className="w-full h-full relative cursor-grab active:cursor-grabbing">
                            <div className="pointer-events-auto" onPointerDown={(e) => {
                                // If the click targets a button, don't start dragging
                                if ((e.target as HTMLElement).closest('button')) {
                                    e.stopPropagation();
                                }
                            }}>
                                {children}
                            </div>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

