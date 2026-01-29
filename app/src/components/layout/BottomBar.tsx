import React from 'react';
import { useStore } from '../../store/useStore';
import { Compass, Star } from 'lucide-react';
import clsx from 'clsx';

export const BottomBar: React.FC = () => {
    const activeTool = useStore((state) => state.activeTool);
    const compass = useStore((state) => state.compass);
    const toggleCompass = useStore((state) => state.toggleCompass);
    const showFlyStar = useStore((state) => state.showFlyStar);
    const toggleFlyStar = useStore((state) => state.toggleFlyStar);

    return (
        <div className="h-8 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-300 select-none z-30">
            <div className="flex items-center space-x-4">
                <div className="text-gray-400">
                    Tool: <span className="text-white font-medium capitalize">{activeTool}</span>
                </div>
                {/* Coordinates or Zoom status could go here */}
            </div>

            <div className="flex items-center space-x-2 h-full py-1">
                <button
                    onClick={toggleCompass}
                    className={clsx(
                        "px-3 h-full flex items-center rounded transition-colors space-x-2",
                        compass.visible ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                    )}
                >
                    <Compass size={14} />
                    <span>Compass</span>
                </button>

                <button
                    onClick={toggleFlyStar}
                    className={clsx(
                        "px-3 h-full flex items-center rounded transition-colors space-x-2",
                        showFlyStar ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                    )}
                >
                    <Star size={14} />
                    <span>Fly Star</span>
                </button>
            </div>
        </div>
    );
};
