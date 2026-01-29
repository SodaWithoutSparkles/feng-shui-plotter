import React from 'react';
import { useStore } from '../../store/useStore';
import { MousePointer2, Square, Circle, Minus, Star, Type, ArrowRight, Pipette } from 'lucide-react';
import clsx from 'clsx';

export const LeftSidebar: React.FC = () => {
    const activeTool = useStore((state) => state.activeTool);
    const setActiveTool = useStore((state) => state.setActiveTool);

    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select (V)' },
        { id: 'rectangle', icon: Square, label: 'Rectangle (M)' },
        { id: 'ellipse', icon: Circle, label: 'Ellipse (L)' },
        { id: 'line', icon: Minus, label: 'Line (P)' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)' },
        { id: 'star', icon: Star, label: 'Star (S)' },
        { id: 'text', icon: Type, label: 'Text (T)' },
    ] as const;

    return (
        <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2 space-y-1 z-20">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={clsx(
                        "p-2 rounded hover:bg-gray-700 transition-colors relative group",
                        activeTool === tool.id ? "bg-gray-700 text-blue-400" : "text-gray-400"
                    )}
                    title={tool.label}
                >
                    <tool.icon size={20} />
                    {/* Tooltip on hover could go here */}
                </button>
            ))}

            <div className="w-8 h-px bg-gray-600 my-2" />

            <button
                className="p-2 rounded hover:bg-gray-700 text-gray-400"
                title="Color Picker"
            >
                <Pipette size={20} />
            </button>

            {/* Color Swatches placeholder */}
            <div className="mt-4 flex flex-col items-center space-y-2">
                <div className="w-6 h-6 bg-black border border-gray-500 rounded-sm cursor-pointer" title="Stroke" />
                <div className="w-6 h-6 bg-transparent border-2 border-white rounded-sm cursor-pointer" title="Fill" />
            </div>
        </div>
    );
};
