import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export const ToolSettingsModal: React.FC = () => {
    const showToolSettings = useStore((state) => state.showToolSettings);
    const setShowToolSettings = useStore((state) => state.setShowToolSettings);
    const activeTool = useStore((state) => state.activeTool);
    const toolSettings = useStore((state) => state.toolSettings);
    const setToolSettings = useStore((state) => state.setToolSettings);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Removed click outside listener to make it non-blocking/modeless
    }, [showToolSettings, setShowToolSettings]);

    if (!showToolSettings) return null;

    const isTextTool = activeTool === 'text' || activeTool === 'callout';
    const isShapeTool = ['rectangle', 'ellipse', 'line', 'arrow', 'star', 'callout'].includes(activeTool);

    return (
        <div
            ref={modalRef}
            className="absolute left-full top-0 ml-4 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 min-w-[250px] z-50 pointer-events-auto"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-100 capitalize">
                    {activeTool} Tool Settings
                </h2>
                <button
                    onClick={() => setShowToolSettings(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Line Width for shape tools */}
                {isShapeTool && (
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">
                            Line Width: {toolSettings.lineWidth}px
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            step="1"
                            value={toolSettings.lineWidth}
                            onChange={(e) =>
                                setToolSettings({ lineWidth: parseInt(e.target.value) })
                            }
                            className="w-full"
                        />
                    </div>
                )}

                {/* Font settings for text tool */}
                {isTextTool && (
                    <>
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Font Size: {toolSettings.fontSize}px
                            </label>
                            <input
                                type="range"
                                min="8"
                                max="72"
                                step="1"
                                value={toolSettings.fontSize}
                                onChange={(e) =>
                                    setToolSettings({ fontSize: parseInt(e.target.value) })
                                }
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Font Family
                            </label>
                            <select
                                value={toolSettings.fontFamily}
                                onChange={(e) => setToolSettings({ fontFamily: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Font Weight
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setToolSettings({ fontWeight: 'normal' })}
                                    className={`flex-1 px-3 py-2 rounded border ${toolSettings.fontWeight === 'normal'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => setToolSettings({ fontWeight: 'bold' })}
                                    className={`flex-1 px-3 py-2 rounded border font-bold ${toolSettings.fontWeight === 'bold'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Bold
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Font Style
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setToolSettings({ fontStyle: 'normal' })}
                                    className={`flex-1 px-3 py-2 rounded border ${toolSettings.fontStyle === 'normal'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => setToolSettings({ fontStyle: 'italic' })}
                                    className={`flex-1 px-3 py-2 rounded border italic ${toolSettings.fontStyle === 'italic'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Italic
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Text Align
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setToolSettings({ textAlign: 'left' })}
                                    className={`flex-1 px-3 py-2 rounded border ${toolSettings.textAlign === 'left'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Left
                                </button>
                                <button
                                    onClick={() => setToolSettings({ textAlign: 'center' })}
                                    className={`flex-1 px-3 py-2 rounded border ${toolSettings.textAlign === 'center'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Center
                                </button>
                                <button
                                    onClick={() => setToolSettings({ textAlign: 'right' })}
                                    className={`flex-1 px-3 py-2 rounded border ${toolSettings.textAlign === 'right'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    Right
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Font Color
                            </label>
                            <div className="flex items-center space-x-3">
                                <ColorPicker
                                    color={toolSettings.textColor}
                                    onChange={(color) => setToolSettings({ textColor: color })}
                                />
                                <span className="text-xs text-gray-400">{toolSettings.textColor.toUpperCase()}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setShowToolSettings(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    done
                </button>
            </div>
        </div>
    );
};
