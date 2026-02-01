import React from 'react';
import { Lock, Calendar } from 'lucide-react';
import { genFullFlyStarSeq, DIGIT_TO_CHINESE } from '../utils/FengShui';
import type { FengShuiData } from '../types';
import { PopoverSlider } from './common/PopoverSlider';

interface FlystarVisualizationProps {
    fengShui: FengShuiData;
    updateFengShui?: (updates: Partial<FengShuiData>) => void;
    showControls?: boolean;
    showYear?: boolean;
}

interface NumberStepperProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    className?: string;
    children?: React.ReactNode;
}

const NumberStepper: React.FC<NumberStepperProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    className = "",
    children
}) => {
    const handleDecrement = () => {
        if (min !== undefined && value <= min) return;
        onChange(value - 1);
    };

    const handleIncrement = () => {
        if (max !== undefined && value >= max) return;
        onChange(value + 1);
    };

    return (
        <div className={`flex items-center justify-between py-1 border-b border-gray-700 last:border-0 ${className}`}>
            <span className="text-xs text-gray-300 font-medium mr-2">{label}</span>
            <div className="flex items-center justify-end space-x-2">
                {children}
                <div className="flex items-center bg-gray-900 rounded border border-gray-600">
                    <button
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-l transition-colors"
                        onClick={handleDecrement}
                        title="Decrease"
                    >
                        -
                    </button>
                    <div className="w-8 flex items-center justify-center text-white font-mono text-xs border-l border-r border-gray-700 h-6 bg-gray-900">
                        {value}
                    </div>
                    <button
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-r transition-colors"
                        onClick={handleIncrement}
                        title="Increase"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FlystarVisualization: React.FC<FlystarVisualizationProps> = ({
    fengShui,
    updateFengShui,
    showControls = true,
    showYear = true
}) => {
    const canCalculate = fengShui && fengShui.purples;
    const currentYear = new Date().getFullYear();

    // Determine display year
    // If viewMode is 'manual', use manualYear.
    // If 'auto' (or undefined/legacy), calculate from offset and calculated_at.
    let displayYear = currentYear;
    const isManual = fengShui?.purples?.viewMode === 'manual';

    if (isManual && fengShui.purples.manualYear) {
        displayYear = fengShui.purples.manualYear;
    } else {
        const offset = fengShui?.purples?.offset || 0;
        const startFrom = fengShui?.purples?.calculated_at ? new Date(fengShui.purples.calculated_at).getFullYear() : currentYear;
        displayYear = startFrom + offset;
    }
    console.log('calculating flystar for year:', displayYear, { isManual, fengShui });
    const flyStarData = canCalculate ? genFullFlyStarSeq(fengShui, displayYear) : null;

    // Determine layout: Side-by-side if controls are ON and stand-alone year is OFF.
    // If showYear is true (and passed from parent like sidebar), force top-bottom.
    const isSideBySide = showControls && !showYear;
    const showStandaloneYear = showYear && !showControls;
    console.log('FlystarVisualization render:', { isSideBySide, displayYear, isManual, showStandaloneYear });
    const handleYearChange = (val: number) => {
        if (!updateFengShui) return;
        let wasCalculatedAt = fengShui.purples.calculated_at ? new Date(fengShui.purples.calculated_at).getFullYear() : currentYear;
        const offset = wasCalculatedAt - val;
        console.log('Handle Year Change:', { val, wasCalculatedAt, offset });
        updateFengShui({
            purples: {
                ...fengShui.purples,
                viewMode: 'manual',
                manualYear: val,
                offset: offset
            }
        });
    };

    // Toggle between Auto (Current Year) and Manual (Fixed Year)
    const toggleAuto = () => {
        if (!updateFengShui) return;
        let wasCalculatedAt = fengShui.purples.calculated_at ? new Date(fengShui.purples.calculated_at).getFullYear() : currentYear;
        let offset = 0;
        if (isManual) {
            // Switch to Auto -> Sync with Now
            offset = currentYear - wasCalculatedAt;
            updateFengShui({
                purples: {
                    ...fengShui.purples,
                    viewMode: 'auto',
                    offset: 0
                }
            });
        } else {
            // Switch to Manual -> Lock at current display
            offset = displayYear - wasCalculatedAt;
            updateFengShui({
                purples: {
                    ...fengShui.purples,
                    viewMode: 'manual',
                    manualYear: displayYear,
                    offset: offset
                }
            });
        }
    };

    if (!flyStarData) {
        return (
            <div className="p-4 text-center text-gray-400">
                <p>Feng Shui data not available</p>
            </div>
        );
    }

    return (
        <div className={isSideBySide ? "flex gap-4 items-start" : "space-y-4"}>
            {/* 3x3 Grid */}
            <div className={isSideBySide ? "w-[220px] shrink-0" : "max-w-[250px] mx-auto"}>
                <div className="grid grid-cols-3 aspect-square border-2 border-gray-600 bg-white text-black text-xs">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="border border-gray-400 relative">
                            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                                {/* Top Left: Blue */}
                                <div className="flex items-center justify-center font-bold text-blue-600 text-base sm:text-base">
                                    {flyStarData.blues[i].toString()}
                                </div>
                                {/* Top Right: Red */}
                                <div className="flex items-center justify-center font-bold text-red-600 text-base sm:text-base">
                                    {flyStarData.reds[i].toString()}
                                </div>
                                {/* Bottom Left: Black (Chinese) */}
                                <div className="flex items-center justify-center font-bold text-black text-lg sm:text-xl">
                                    {DIGIT_TO_CHINESE[Number(flyStarData.blacks[i])]}
                                </div>
                                {/* Bottom Right: Purple (Yellow BG) */}
                                <div className="flex items-center justify-center font-bold text-purple-600 bg-yellow-100 relative text-lg sm:text-xl">
                                    {flyStarData.purples[i].toString()}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-300 opacity-50" />
                                    <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-300 opacity-50" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-grow space-y-4">
                {/* Year */}
                {
                    showStandaloneYear && updateFengShui && (
                        <div className="flex flex-col p-3 text-sm bg-gray-800 rounded-lg shadow-inner">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 font-medium text-xs">Year ({displayYear})</span>
                                <button
                                    onClick={toggleAuto}
                                    title={isManual ? "Switch to Auto-Sync" : "Lock to Current Year"}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${isManual
                                        ? 'bg-blue-900/40 border-blue-700 text-blue-300 hover:bg-blue-900/60'
                                        : 'bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                                        }`}
                                >
                                    {isManual ? (
                                        <>Locked <Lock size={10} /></>
                                    ) : (
                                        <>Auto <Calendar size={10} /></>
                                    )}
                                </button>
                            </div>
                            <PopoverSlider
                                value={displayYear}
                                onChange={handleYearChange}
                                min={1900}
                                max={2100}
                                hideSlider={true}
                                presets={[
                                    { label: 'Now', value: currentYear },
                                    { label: 'Next', value: currentYear + 1 }
                                ]}
                            />
                        </div>
                    )
                }

                {/* Controls */}
                {showControls && updateFengShui && (
                    <div className="flex flex-col p-3 text-sm bg-gray-800 rounded-lg shadow-inner w-[220px]">
                        {/* <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-gray-300 font-medium text-xs">Year</span>
                                <span className={`text-xs ${isManual ? 'text-blue-300' : 'text-green-300'}`}>
                                    {displayYear}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleAuto}
                                    title={isManual ? "Switch to Auto-Sync" : "Lock to Current Year"}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${isManual
                                        ? 'bg-blue-900/40 border-blue-700 text-blue-300 hover:bg-blue-900/60'
                                        : 'bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                                        }`}
                                >
                                    {isManual ? (
                                        <>Locked <Lock size={10} /></>
                                    ) : (
                                        <>Auto <Calendar size={10} /></>
                                    )}
                                </button>
                            </div>
                        </div> */}

                        <div className="mb-4">
                            <PopoverSlider
                                value={displayYear}
                                onChange={handleYearChange}
                                min={1900}
                                max={2100}
                                hideSlider={true}
                                presets={[
                                    { label: 'Now', value: currentYear },
                                    { label: 'Next', value: currentYear + 1 }
                                ]}
                            />
                        </div>

                        <NumberStepper
                            label="Blacks"
                            value={fengShui.blacks.start}
                            min={1}
                            max={9}
                            onChange={(val) => updateFengShui({ blacks: { start: val } })}
                        />

                        <NumberStepper
                            label="Reds"
                            value={fengShui.reds.start}
                            min={1}
                            max={9}
                            onChange={(val) => updateFengShui({ reds: { ...fengShui.reds, start: val } })}
                        >
                            <button
                                onClick={() => updateFengShui({ reds: { ...fengShui.reds, reversed: !fengShui.reds.reversed } })}
                                className={`px-2 py-[2px] text-[10px] uppercase font-bold tracking-wider rounded border ${fengShui.reds.reversed
                                    ? 'bg-blue-900 border-blue-700 text-blue-100 shadow-sm'
                                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                                    }`}
                                title="Toggle Reversed Direction"
                            >
                                Rev
                            </button>
                        </NumberStepper>

                        <NumberStepper
                            label="Blues"
                            value={fengShui.blues.start}
                            min={1}
                            max={9}
                            onChange={(val) => updateFengShui({ blues: { ...fengShui.blues, start: val } })}
                        >
                            <button
                                onClick={() => updateFengShui({ blues: { ...fengShui.blues, reversed: !fengShui.blues.reversed } })}
                                className={`px-2 py-[2px] text-[10px] uppercase font-bold tracking-wider rounded border ${fengShui.blues.reversed
                                    ? 'bg-blue-900 border-blue-700 text-blue-100 shadow-sm'
                                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                                    }`}
                                title="Toggle Reversed Direction"
                            >
                                Rev
                            </button>
                        </NumberStepper>

                        <NumberStepper
                            label="Purples"
                            value={fengShui.purples.start}
                            min={1}
                            max={9}
                            onChange={(val) => updateFengShui({ purples: { ...fengShui.purples, start: val } })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
