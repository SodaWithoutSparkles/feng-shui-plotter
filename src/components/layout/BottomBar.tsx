import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Compass, Star } from 'lucide-react';
import clsx from 'clsx';

export const BottomBar: React.FC = () => {
    const activeTool = useStore((state) => state.activeTool);
    const compass = useStore((state) => state.compass);
    const toggleCompass = useStore((state) => state.toggleCompass);
    const showFlyStar = useStore((state) => state.showFlyStar);
    const toggleFlyStar = useStore((state) => state.toggleFlyStar);
    const autoSave = useStore((state) => state.autoSave);
    const lastAutoSaveAt = useStore((state) => state.lastAutoSaveAt);

    // Keep time-sensitive statuses fresh by forcing a re-render every 10s when nothing else changes.
    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 10000);
        return () => clearInterval(id);
    }, []);

    const getAutoSaveStatus = () => {
        if (!autoSave) return 'Auto-save off';
        if (!lastAutoSaveAt) return 'Auto-save on';
        const seconds = Math.floor((Date.now() - lastAutoSaveAt) / 1000);
        if (seconds < 5) return 'Auto-saved just now';
        if (seconds < 60) return `Auto-saved ${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `Auto-saved ${minutes}m ago`;
    };

    return (
        <div className="h-8 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-300 select-none z-30">
            <div className="flex items-center space-x-4">
                <div className="text-gray-400">
                    Tool: <span className="text-white font-medium capitalize">{activeTool}</span>
                </div>
                <div className="text-gray-400">
                    <span className={autoSave ? 'text-green-400' : 'text-gray-500'}>{getAutoSaveStatus()}</span>
                </div>
                {/* Coordinates or Zoom status could go here */}
            </div>

            <div className="flex items-center space-x-2 h-full py-1">
                <button
                    onClick={toggleCompass}
                    className={clsx(
                        "px-3 h-full flex items-center rounded transition-colors space-x-2",
                        compass.mode !== 'hidden' ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                    )}
                    title="Click to cycle modes: Hidden -> Visible -> Edit -> Projections"
                >
                    <Compass size={14} />
                    <span>
                        {compass.mode === 'hidden' && 'Compass'}
                        {compass.mode === 'visible' && 'Compass (View)'}
                        {compass.mode === 'interactive' && 'Compass (Edit)'}
                        {compass.mode === 'projections' && 'Compass (Proj)'}
                        {!compass.mode && (compass.visible ? 'Compass (View)' : 'Compass')}
                    </span>
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
