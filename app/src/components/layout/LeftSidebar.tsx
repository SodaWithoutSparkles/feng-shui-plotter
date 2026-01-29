import React from 'react';
import { useStore } from '../../store/useStore';
import { MousePointer2, Square, Circle, Minus, Star, Type, ArrowRight, Pipette } from 'lucide-react';
import clsx from 'clsx';
import { ColorPicker } from '../common/ColorPicker';

export const LeftSidebar: React.FC = () => {
    const activeTool = useStore((state) => state.activeTool);
    const setActiveTool = useStore((state) => state.setActiveTool);
    const colors = useStore((state) => state.colors);
    const setColors = useStore((state) => state.setColors);
    const isDropperActive = useStore((state) => state.isDropperActive);
    const setDropperActive = useStore((state) => state.setDropperActive);

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
                    onClick={() => {
                        setActiveTool(tool.id);
                        setDropperActive(false);
                    }}
                    className={clsx(
                        "p-2 rounded hover:bg-gray-700 transition-colors relative group",
                        activeTool === tool.id && !isDropperActive ? "bg-gray-700 text-blue-400" : "text-gray-400"
                    )}
                    title={tool.label}
                >
                    <tool.icon size={20} />
                </button>
            ))}

            <div className="w-8 h-px bg-gray-600 my-2" />

            <button
                className={clsx(
                    "p-2 rounded hover:bg-gray-700 transition-colors relative group",
                    isDropperActive ? "bg-gray-700 text-blue-400" : "text-gray-400"
                )}
                title="Color Picker (I)"
                onClick={() => setDropperActive(!isDropperActive)}
            >
                <Pipette size={20} />
            </button>

            <div className="mt-4 flex flex-col items-center space-y-3">
                {/* Stroke Color */}
                <div className="relative group">
                    <ColorPicker
                        color={colors.stroke}
                        onChange={(newColor) => setColors({ stroke: newColor, active: 'stroke' })}
                        supportsAlpha={false}
                    />
                </div>

                {/* Fill Color */}
                <div className="relative group">
                    <ColorPicker
                        color={colors.fill}
                        onChange={(newColor) => setColors({ fill: newColor, active: 'fill' })}
                        supportsAlpha={true}
                    />
                </div>
            </div>
        </div>
    );
};
