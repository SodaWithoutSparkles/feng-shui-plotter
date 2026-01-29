import React from 'react';
import { useStore } from '../../store/useStore';
import { Layers, History, Settings } from 'lucide-react';

export const RightSidebar: React.FC = () => {
    const history = useStore((state) => state.history);
    const items = useStore((state) => state.items);
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
                        <div className="space-y-4 p-2 text-sm">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Blacks Start</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                    value={fengShui.blacks.start}
                                    onChange={(e) => updateFengShui({ blacks: { ...fengShui.blacks, start: parseInt(e.target.value) || 0 } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Reds Start</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                        value={fengShui.reds.start}
                                        onChange={(e) => updateFengShui({ reds: { ...fengShui.reds, start: parseInt(e.target.value) || 0 } })}
                                    />
                                    <label className="flex items-center space-x-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={fengShui.reds.reversed}
                                            onChange={(e) => updateFengShui({ reds: { ...fengShui.reds, reversed: e.target.checked } })}
                                        />
                                        <span className="text-xs">Rev</span>
                                    </label>
                                </div>
                            </div>
                            {/* Blue and Purple placeholders */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Blues Start</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                        value={fengShui.blues.start}
                                        onChange={(e) => updateFengShui({ blues: { ...fengShui.blues, start: parseInt(e.target.value) || 0 } })}
                                    />
                                    <label className="flex items-center space-x-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={fengShui.blues.reversed}
                                            onChange={(e) => updateFengShui({ blues: { ...fengShui.blues, reversed: e.target.checked } })}
                                        />
                                        <span className="text-xs">Rev</span>
                                    </label>
                                </div>
                            </div>
                        </div>
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
                        {[...items].reverse().map((item, i) => (
                            <li key={item.id} className="text-sm px-2 py-1 hover:bg-gray-700 rounded cursor-pointer flex items-center">
                                <span className="opacity-50 mr-2 text-xs">#{i + 1}</span>
                                <span className="capitalize">{item.type}</span>
                            </li>
                        ))}
                        {items.length === 0 && <li className="text-gray-500 italic text-xs p-2">No objects</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};
