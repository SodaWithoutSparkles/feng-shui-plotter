import React from 'react';
import { MenuItem } from './MenuItem';

interface CompassState {
    locked: boolean;
    opacity: number;
    radius: number;
}

interface OptionsMenuProps {
    activeMenu: string | null;
    onToggle: (menu: string) => void;
    onCloseMenu: () => void;
    compass: CompassState;
    onUpdateCompass: (updates: Partial<CompassState>) => void;
    onShowShortcutConfig: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
    activeMenu,
    onToggle,
    onCloseMenu,
    compass,
    onUpdateCompass,
    onShowShortcutConfig
}) => {
    return (
        <div className="relative">
            <div
                className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'option' ? 'bg-gray-700' : ''}`}
                onClick={() => onToggle('option')}
            >
                Options
            </div>
            {activeMenu === 'option' && (
                <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                    <MenuItem label="About" onClick={() => { alert('Feng Shui Plotter v0.1.0\nBuilt with React & Vite'); onCloseMenu(); }} />

                    <div className="h-px bg-gray-700 my-1" />
                    <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Compass</div>

                    <div
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateCompass({ locked: !compass.locked });
                        }}
                    >
                        <div className="flex items-center">
                            <span className={`w-4 mr-2 text-blue-400 font-bold`}>{compass.locked ? '✓' : ''}</span>
                            <span>Lock to South</span>
                        </div>
                    </div>

                    <div className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between text-xs text-text-gray-300 mb-1">
                            <span>Opacity</span>
                            <span>{Math.round(compass.opacity * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1" max="1" step="0.01"
                            value={compass.opacity}
                            onChange={(e) => onUpdateCompass({ opacity: parseFloat(e.target.value) })}
                            className="w-full accent-blue-500 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                            <span>Radius</span>
                            <span>{Math.round(compass.radius)}px</span>
                        </div>
                        <input
                            type="range"
                            min="50" max="600" step="10"
                            value={compass.radius}
                            onChange={(e) => onUpdateCompass({ radius: parseFloat(e.target.value) })}
                            className="w-full accent-blue-500 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="h-px bg-gray-700 my-1" />
                    <MenuItem
                        label="Keyboard Shortcuts..."
                        onClick={() => { onShowShortcutConfig(); onCloseMenu(); }}
                    />
                </div>
            )}
        </div>
    );
};
