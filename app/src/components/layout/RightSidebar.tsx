import React from 'react';
import { useStore } from '../../store/useStore';
import { Layers, History, Settings } from 'lucide-react';
import { FlystarVisualization } from '../FlystarVisualization';

export const RightSidebar: React.FC = () => {
    const history = useStore((state) => state.history);
    const objects = useStore((state) => state.objects);
    const selectedIds = useStore((state) => state.selectedIds);
    const selectItem = useStore((state) => state.selectItem);
    const showFlyStar = useStore((state) => state.showFlyStar);
    const fengShui = useStore((state) => state.fengShui);
    const updateFengShui = useStore((state) => state.updateFengShui);

    return (
        <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col text-gray-300 z-20">
            {/* Top Half: History OR Fly Star */}
            <div className="flex-1 flex flex-col border-b border-gray-700 min-h-0">
                <div className="bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center">
                    {showFlyStar ? <><Settings size={12} className="mr-2" /> Fly Star Settings</> : <><History size={12} className="mr-2" /> History</>}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {showFlyStar ? (
                        <FlystarVisualization
                            fengShui={fengShui}
                            updateFengShui={updateFengShui}
                            showControls={false}
                            showYear={true}
                        />
                    ) : (
                        <ul className="space-y-1">
                            {history.map((action, i) => (
                                <li key={i} className="text-sm px-2 py-1 hover:bg-gray-700 rounded cursor-pointer truncate">
                                    {action}
                                </li>
                            ))}
                            {history.length === 0 && <li className="text-gray-500 italic text-xs p-2">No history</li>}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bottom Half: Objects / Layers */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
                <div className="bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center">
                    <Layers size={12} className="mr-2" /> Objects
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {/* Render Objects in Reverse order (Top on list = Top z-index usually, or logic can vary) */}
                        {[...objects].reverse().map((item, i) => (
                            <li
                                key={item.id}
                                className={`text-sm px-2 py-1 rounded cursor-pointer flex items-center ${selectedIds.includes(item.id) ? 'bg-blue-900 text-white' : 'hover:bg-gray-700'}`}
                                onClick={() => selectItem(item.id)}
                            >
                                <span className="opacity-50 mr-2 text-xs">#{objects.length - 1 - i}</span>
                                <span className="capitalize">{item.type}</span>
                            </li>
                        ))}
                        {objects.length === 0 && <li className="text-gray-500 italic text-xs p-2">No objects</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};
