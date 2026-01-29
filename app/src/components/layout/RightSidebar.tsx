import React from 'react';
import { useStore } from '../../store/useStore';
import { Layers, History, Settings } from 'lucide-react';
import { genFullFlyStarSeq, DIGIT_TO_CHINESE } from '../../utils/FengShui';

export const RightSidebar: React.FC = () => {
    const history = useStore((state) => state.history);
    const objects = useStore((state) => state.objects);
    const showFlyStar = useStore((state) => state.showFlyStar);
    const fengShui = useStore((state) => state.fengShui);
    const updateFengShui = useStore((state) => state.updateFengShui);

    // Safety check for fengShui data before calculation
    const canCalculate = fengShui && fengShui.purples;
    const flyStarData = (showFlyStar && canCalculate) ? genFullFlyStarSeq(fengShui, new Date().getFullYear()) : null;

    return (
        <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col text-gray-300 z-20">
            {/* Top Half: History OR Fly Star */}
            <div className="flex-1 flex flex-col border-b border-gray-700 min-h-0">
                <div className="bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center">
                    {showFlyStar ? <><Settings size={12} className="mr-2" /> Fly Star Settings</> : <><History size={12} className="mr-2" /> History</>}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {showFlyStar && flyStarData ? (
                        <div className="space-y-4">
                            {/* 3x3 Grid */}
                            <div className="grid grid-cols-3 aspect-square border-2 border-gray-600 bg-white text-black text-xs">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="border border-gray-400 relative">
                                        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                                            {/* Top Left: Blue */}
                                            <div className="flex items-center justify-center font-bold text-blue-600">
                                                {flyStarData.blues[i].toString()}
                                            </div>
                                            {/* Top Right: Red */}
                                            <div className="flex items-center justify-center font-bold text-red-600">
                                                {flyStarData.reds[i].toString()}
                                            </div>
                                            {/* Bottom Left: Black (Chinese) */}
                                            <div className="flex items-center justify-center font-bold text-black text-sm">
                                                {DIGIT_TO_CHINESE[Number(flyStarData.blacks[i])]}
                                            </div>
                                            {/* Bottom Right: Purple (Yellow BG) */}
                                            <div className="flex items-center justify-center font-bold text-purple-600 bg-yellow-100 relative">
                                                {flyStarData.purples[i].toString()}
                                                {/* "Inner grid lines... except bottom right cell" - Adding borders to define the BR cell? */}
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-300 opacity-50" />
                                                <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-300 opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 p-2 text-sm bg-gray-800 rounded">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Purples Start</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                        value={fengShui.purples.start}
                                        onChange={(e) => updateFengShui({ purples: { ...fengShui.purples, start: parseInt(e.target.value) || 0 } })}
                                    />
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
