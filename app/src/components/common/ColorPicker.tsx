import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    supportsAlpha?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, supportsAlpha = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localColor, setLocalColor] = useState(color === 'transparent' ? '#000000' : color);
    const [alpha, setAlpha] = useState(color === 'transparent' ? 0 : 1);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse color to extract alpha if it's rgba
        if (color.startsWith('rgba')) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                const [, r, g, b, a] = match;
                setLocalColor(`#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`);
                setAlpha(parseFloat(a || '1'));
            }
        } else if (color === 'transparent') {
            setLocalColor('#000000');
            setAlpha(0);
        } else if (color.startsWith('#')) {
            setLocalColor(color);
            setAlpha(1);
        }
    }, [color]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleColorChange = (newColor: string) => {
        setLocalColor(newColor);
        applyColor(newColor, alpha);
    };

    const handleAlphaChange = (newAlpha: number) => {
        setAlpha(newAlpha);
        applyColor(localColor, newAlpha);
    };

    const applyColor = (hexColor: string, alphaValue: number) => {
        if (supportsAlpha) {
            if (alphaValue === 0) {
                onChange('transparent');
            } else if (alphaValue === 1) {
                onChange(hexColor);
            } else {
                // Convert hex to rgba
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                onChange(`rgba(${r}, ${g}, ${b}, ${alphaValue})`);
            }
        } else {
            onChange(hexColor);
        }
    };

    const displayColor = alpha === 0 ? 'transparent' : localColor;

    return (
        <div className="relative" ref={pickerRef}>
            <div
                className="w-6 h-6 rounded-sm border-2 border-gray-500 cursor-pointer hover:border-gray-400 transition-colors relative overflow-hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Checkerboard pattern for transparency */}
                {supportsAlpha && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                            backgroundSize: '8px 8px',
                            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                        }}
                    />
                )}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: displayColor,
                        opacity: alpha
                    }}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 bg-gray-800 border border-gray-600 rounded-md shadow-xl p-3 z-50 min-w-[200px]">
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Color</label>
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

                        <div className="flex flex-wrap gap-1">
                            <div className="text-xs text-gray-400 w-full mb-1">Presets:</div>
                            {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((preset) => (
                                <div
                                    key={preset}
                                    className="w-6 h-6 rounded cursor-pointer border border-gray-600 hover:border-gray-400"
                                    style={{ backgroundColor: preset }}
                                    onClick={() => handleColorChange(preset)}
                                />
                            ))}
                            {supportsAlpha && (
                                <div
                                    className="w-6 h-6 rounded cursor-pointer border border-gray-600 hover:border-gray-400 relative overflow-hidden"
                                    onClick={() => handleAlphaChange(0)}
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                                            backgroundSize: '6px 6px',
                                            backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-[1px] h-[120%] bg-red-500 rotate-45" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
