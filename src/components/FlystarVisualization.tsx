import React, { useMemo } from 'react';
import { Lock, Calendar } from 'lucide-react';
import { genFullFlyStarSeq, DIGIT_TO_CHINESE } from '../utils/FengShui';
import type { FengShuiData } from '../types';
import { PopoverSlider } from './common/PopoverSlider';

interface FlystarVisualizationProps {
    fengShui: FengShuiData;
    updateFengShui?: (updates: Partial<FengShuiData>) => void;
    /**
     * Master switch for any controls.
     * If false, shows only the Compass/Grid visualization.
     * If true, shows at least the Year control.
     * @default true
     */
    showControls?: boolean;
    /**
     * If true, shows the full suite of steppers (Blacks/Reds/Blues/Purples).
     * If false, shows only the Year adjustment and Method indicator.
     * Also determines layout: True = Side-by-Side (Large), False = Stacked (Compact).
     * @default true
     */
    showFullSettings?: boolean;
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

const FlystarVisualizationComponent: React.FC<FlystarVisualizationProps> = ({
    fengShui,
    updateFengShui,
    showControls = true,
    showFullSettings = true
}) => {
    const canCalculate = Boolean(fengShui?.purples);
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

    // Debug logging
    // console.log('calculating flystar for year:', displayYear, { isManual, fengShui });

    const flyStarData = useMemo(
        () => (canCalculate ? genFullFlyStarSeq(fengShui, displayYear) : null),
        [canCalculate, fengShui, displayYear]
    );

    // Human-readable labels for methods
    const methodLabels: Record<string, string> = {
        shen_shi_3: '沈氏 (3°)',
        shen_shi_45: '沈氏 (4.5°)',
        zhong_zhou_3: '中州 (3°)',
        zhong_zhou_45: '中州 (4.5°)'
    };
    const methodKey = (fengShui?.method ?? 'shen_shi_45') as string;
    const methodLabel = methodLabels[methodKey] || methodKey;
    const methodName = methodKey.startsWith('shen_shi') ? 'Shen Shi' : 'Zhong Zhou';
    const threshold = methodKey.endsWith('_3') ? '3' : '4.5';
    const methodTooltip = `Using ${methodName} method with ${threshold} degree Jian threshold`;

    // Determine layout
    // If showFullSettings is true, we use a Side-By-Side layout (Large display).
    // If showFullSettings is false, we use a Stacked layout (Compact/Sidebar).
    const isSideBySide = showFullSettings;

    const handleYearChange = (val: number) => {
        if (!updateFengShui) return;
        let wasCalculatedAt = fengShui.purples.calculated_at ? new Date(fengShui.purples.calculated_at).getFullYear() : currentYear;
        const offset = wasCalculatedAt - val;
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

    // New Refactored Controls Component
    const ControlsSection = () => (
        <div className="flex flex-col p-3 text-sm bg-gray-800 rounded-lg shadow-inner w-full min-w-[200px]">
            {/* Year Control Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium text-xs">Year ({displayYear})</span>
                <div className="flex items-center gap-2">
                    {/* Method Indicator - Compact */}
                    <div
                        className="px-1.5 py-0.5 rounded bg-gray-700 border border-gray-600 text-[10px] text-gray-300 whitespace-nowrap"
                        title={methodTooltip}
                    >
                        {methodLabel}
                    </div>
                </div>
            </div>

            {/* Year Slider Row with Lock Button */}
            {!showFullSettings && (<div className="flex items-center gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <PopoverSlider
                        value={displayYear}
                        onChange={handleYearChange}
                        min={1900}
                        max={2100}
                        hideSlider={true}
                        popoverAlign="start"
                        presets={[
                            { label: 'Now', value: currentYear },
                            { label: 'Next', value: currentYear + 1 }
                        ]}
                    />
                </div>
                <button
                    onClick={toggleAuto}
                    title={isManual ? "Switch to Auto-Sync" : "Lock to Current Year"}
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-7 rounded border transition-all ${isManual
                        ? 'bg-blue-900/40 border-blue-700 text-blue-300 hover:bg-blue-900/60'
                        : 'bg-emerald-900/40 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                >
                    {isManual ? <Lock size={14} /> : <Calendar size={14} />}
                </button>
            </div>)}

            {/* Full Settings: Steppers */}
            {showFullSettings && (
                <div className="space-y-0 border-t border-gray-700 pt-1 mt-1">
                    <NumberStepper
                        label="Blacks"
                        value={fengShui.blacks.start}
                        min={1}
                        max={9}
                        onChange={(val) => updateFengShui && updateFengShui({ blacks: { start: val } })}
                    />

                    <NumberStepper
                        label="Reds"
                        value={fengShui.reds.start}
                        min={1}
                        max={9}
                        onChange={(val) => updateFengShui && updateFengShui({ reds: { ...fengShui.reds, start: val } })}
                    >
                        <button
                            onClick={() => updateFengShui && updateFengShui({ reds: { ...fengShui.reds, reversed: !fengShui.reds.reversed } })}
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
                        onChange={(val) => updateFengShui && updateFengShui({ blues: { ...fengShui.blues, start: val } })}
                    >
                        <button
                            onClick={() => updateFengShui && updateFengShui({ blues: { ...fengShui.blues, reversed: !fengShui.blues.reversed } })}
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
                        onChange={(val) => updateFengShui && updateFengShui({ purples: { ...fengShui.purples, start: val } })}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className={isSideBySide ? "flex gap-4 items-start" : "space-y-4"}>
            {/* 3x3 Grid - Left/Top */}
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

            {/* Controls - Right/Bottom */}
            {showControls && updateFengShui && (
                <div className={isSideBySide ? "w-[250px]" : "w-full"}>
                    <ControlsSection />
                </div>
            )}
        </div>
    );
};

export const FlystarVisualization = React.memo(FlystarVisualizationComponent);
FlystarVisualization.displayName = 'FlystarVisualization';
