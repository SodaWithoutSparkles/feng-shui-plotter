import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface DualColorPickerProps {
    strokeColor: string;
    fillColor: string;
    onColorChange: (type: 'stroke' | 'fill', color: string) => void;
    onActiveTypeChange: (type: 'stroke' | 'fill') => void;
    onPick: () => void;
}

export const DualColorPicker: React.FC<DualColorPickerProps> = ({
    strokeColor,
    fillColor,
    onColorChange,
    onActiveTypeChange,
    onPick
}) => {
    // We track which one we are currently editing in the popup
    const [editingType, setEditingType] = useState<'stroke' | 'fill' | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Global color presets
    const colorPresets = useStore(state => state.colorPresets);
    const addColorPreset = useStore(state => state.addColorPreset);
    const selectColorPreset = useStore(state => state.selectColorPreset);
    const selectedPresetIndex = useStore(state => state.selectedPresetIndex);

    // Current color being edited
    const currentColor = editingType === 'stroke' ? strokeColor : (editingType === 'fill' ? fillColor : '');
    const supportsAlpha = editingType === 'fill';

    const [localColor, setLocalColor] = useState('#000000');
    const [alpha, setAlpha] = useState(1);

    // Sync local state when opening or color changing
    useEffect(() => {
        if (!currentColor) return;

        if (currentColor.startsWith('rgba')) {
            const match = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                const [, r, g, b, a] = match;
                setLocalColor(`#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`);
                setAlpha(parseFloat(a || '1'));
            }
        } else if (currentColor === 'transparent') {
            setLocalColor('#000000');
            setAlpha(0);
        } else if (currentColor.startsWith('#')) {
            setLocalColor(currentColor);
            setAlpha(1);
        }
    }, [currentColor, editingType]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setEditingType(null);
            }
        };

        if (editingType) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingType]);

    const handleColorChange = (newColor: string) => {
        setLocalColor(newColor);
        applyColor(newColor, alpha);
    };

    const handleAlphaChange = (newAlpha: number) => {
        setAlpha(newAlpha);
        applyColor(localColor, newAlpha);
    };

    const applyColor = (hexColor: string, alphaValue: number) => {
        if (!editingType) return;

        let finalColor = hexColor;
        if (supportsAlpha) {
            if (alphaValue === 0) {
                finalColor = 'transparent';
            } else if (alphaValue === 1) {
                finalColor = hexColor;
            } else {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                finalColor = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;
            }
        }

        onColorChange(editingType, finalColor);
    };

    return (
        <div className="relative group" ref={pickerRef}>
            {/* Split Box */}
            <div className="w-8 h-8 rounded border border-gray-600 relative overflow-hidden shadow-sm">

                {/* Visual Background for Transparency (entire box) */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                        backgroundSize: '8px 8px',
                        backgroundColor: '#fff'
                    }}
                />

                {/* Stroke Triangle (Top Left) */}
                <div
                    className="absolute inset-0 cursor-pointer hover:opacity-90 transition-opacity z-10"
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                        backgroundColor: strokeColor
                    }}
                    onClick={() => {
                        onActiveTypeChange('stroke');
                        setEditingType('stroke');
                    }}
                    title="Stroke Color"
                />

                {/* Fill Triangle (Bottom Right) */}
                <div
                    className="absolute inset-0 cursor-pointer hover:opacity-90 transition-opacity z-10"
                    style={{
                        clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
                        backgroundColor: fillColor === 'transparent' ? 'transparent' : fillColor
                    }}
                    onClick={() => {
                        onActiveTypeChange('fill');
                        setEditingType('fill');
                    }}
                    title="Fill Color"
                />
            </div>

            {/* Popup */}
            {editingType && (
                <div className="absolute top-0 left-full ml-2 bg-gray-800 border border-gray-600 rounded-md shadow-xl p-3 z-50 min-w-[200px]">
                    <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">
                        Edit {editingType}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-400 block">Color</label>
                                {onPick && (
                                    <button
                                        onClick={() => {
                                            onPick();
                                            setEditingType(null);
                                        }}
                                        className="text-gray-400 hover:text-blue-400 p-1 rounded hover:bg-gray-700 transition-colors"
                                        title="Pick color from canvas"
                                    >
                                        <Pipette size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={localColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="w-full h-8 cursor-pointer rounded"
                                />
                                <input
                                    type="text"
                                    value={localColor.toUpperCase()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                            setLocalColor(val);
                                            if (val.length === 7) {
                                                handleColorChange(val);
                                            }
                                        }
                                    }}
                                    className="w-20 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {supportsAlpha && (
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">
                                    Opacity: {Math.round(alpha * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={alpha}
                                    onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-gray-400 block">Presets</label>
                                {colorPresets.length < 8 && (
                                    <button
                                        onClick={() => {
                                            addColorPreset({ stroke: strokeColor, fill: fillColor });
                                        }}
                                        className="text-gray-400 hover:text-green-400 p-1 rounded hover:bg-gray-700 transition-colors"
                                        title="Save current colors as preset"
                                    >
                                        <Plus size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {colorPresets.map((preset, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded border cursor-pointer relative overflow-hidden ${selectedPresetIndex === i ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-600 hover:border-gray-400'}`}
                                        onClick={() => {
                                            if (selectedPresetIndex === i) {
                                                // Already selected - open color picker
                                                setEditingType('stroke');
                                            } else {
                                                // Select this preset
                                                selectColorPreset(i);
                                                setEditingType(null);
                                            }
                                        }}
                                        title={`Stroke: ${preset.stroke}, Fill: ${preset.fill}`}
                                    >
                                        {/* Transparency background */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                                                backgroundSize: '8px 8px',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        {/* Stroke Triangle (Top Left) */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                                                backgroundColor: preset.stroke
                                            }}
                                        />
                                        {/* Fill Triangle (Bottom Right) */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
                                                backgroundColor: preset.fill
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
