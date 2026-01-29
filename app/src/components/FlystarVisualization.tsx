import React from 'react';
import { genFullFlyStarSeq, DIGIT_TO_CHINESE } from '../utils/FengShui';
import type { FengShuiData } from '../types';

interface FlystarVisualizationProps {
    fengShui: FengShuiData;
    updateFengShui?: (updates: Partial<FengShuiData>) => void;
    showControls?: boolean;
}

export const FlystarVisualization: React.FC<FlystarVisualizationProps> = ({
    fengShui,
    updateFengShui,
    showControls = true
}) => {
    const canCalculate = fengShui && fengShui.purples;
    const flyStarData = canCalculate ? genFullFlyStarSeq(fengShui, new Date().getFullYear()) : null;

    if (!flyStarData) {
        return (
            <div className="p-4 text-center text-gray-400">
                <p>Feng Shui data not available</p>
            </div>
        );
    }

    return (
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
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-300 opacity-50" />
                                <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-300 opacity-50" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            {showControls && updateFengShui && (
                <div className="space-y-4 p-2 text-sm bg-gray-800 rounded">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Blacks Start</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                            value={fengShui.blacks.start}
                            onChange={(e) => updateFengShui({ blacks: { start: parseInt(e.target.value) || 0 } })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Reds Start</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                            value={fengShui.reds.start}
                            onChange={(e) => updateFengShui({ reds: { ...fengShui.reds, start: parseInt(e.target.value) || 0 } })}
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={fengShui.reds.reversed}
                                onChange={(e) => updateFengShui({ reds: { ...fengShui.reds, reversed: e.target.checked } })}
                            />
                            <span className="text-xs text-gray-400">Reversed</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Blues Start</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                            value={fengShui.blues.start}
                            onChange={(e) => updateFengShui({ blues: { ...fengShui.blues, start: parseInt(e.target.value) || 0 } })}
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={fengShui.blues.reversed}
                                onChange={(e) => updateFengShui({ blues: { ...fengShui.blues, reversed: e.target.checked } })}
                            />
                            <span className="text-xs text-gray-400">Reversed</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Purples Start</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                            value={fengShui.purples.start}
                            onChange={(e) => updateFengShui({ purples: { ...fengShui.purples, start: parseInt(e.target.value) || 0 } })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
