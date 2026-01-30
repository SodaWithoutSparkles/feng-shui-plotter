import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { SaveFile } from '../../types';
import { compress, decompress, compressToBase64 } from '../../utils/compress';
import { ShortcutConfigModal } from '../common/ShortcutConfigModal';
import { ProjectConfigModal } from '../ProjectConfigModal';

export const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showShortcutConfig, setShowShortcutConfig] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // For new project init flow
    const [showProjectInit, setShowProjectInit] = useState(false);

    // Store actions
    const resetProject = useStore(state => state.resetProject);
    const setMode = useStore(state => state.setMode);
    const setFloorplanImage = useStore(state => state.setFloorplanImage);
    const updateFloorplan = useStore(state => state.updateFloorplan);
    const updateFengShui = useStore(state => state.updateFengShui);
    const loadProject = useStore(state => state.loadProject);
    const undo = useStore(state => state.undo);
    const redo = useStore(state => state.redo);
    const cloneSelected = useStore(state => state.cloneSelected);
    const deleteSelected = useStore(state => state.deleteSelected);
    const moveSelectedLayer = useStore(state => state.moveSelectedLayer);
    const updateCompass = useStore(state => state.updateCompass);
    const addItem = useStore(state => state.addItem);
    const autoSave = useStore(state => state.autoSave);
    const toggleAutoSave = useStore(state => state.toggleAutoSave);
    const setLastAutoSaveAt = useStore(state => state.setLastAutoSaveAt);
    const setShowProjectConfig = useStore(state => state.setShowProjectConfig);
    const triggerExport = useStore(state => state.triggerExport);

    // Store state getters for save - fetch individually to prevent re-render loops
    const floorplan = useStore(state => state.floorplan);
    const objects = useStore(state => state.objects);
    const fengShui = useStore(state => state.fengShui);
    const compass = useStore(state => state.compass);
    const version = useStore(state => state.version);

    // Auto-save effect
    useEffect(() => {
        if (autoSave) {
            const timer = setTimeout(async () => {
                const saveData: SaveFile = {
                    floorplan,
                    objects,
                    fengShui,
                    compass,
                    version,
                    timestamp: new Date()
                };
                try {
                    const base64 = await compressToBase64(JSON.stringify(saveData, null, 2));
                    localStorage.setItem('autosave_project', base64);
                    setLastAutoSaveAt(Date.now());
                    console.log('Auto-saved (compressed)'); // Optional confirmation
                } catch (err) {
                    console.error('Failed to compress autosave', err);
                }
            }, 5000); // Auto-save 5s debounce
            return () => clearTimeout(timer);
        }
    }, [floorplan, objects, fengShui, compass, version, autoSave]);

    const handleSave = async () => {
        const saveFile: SaveFile = {
            version,
            timestamp: new Date(),
            floorplan,
            objects,
            fengShui,
            compass
        };

        try {
            const json = JSON.stringify(saveFile, null, 2);
            const compressed = await compress(json);
            const blob = new Blob([compressed], { type: 'application/gzip' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `project-${new Date().toISOString().slice(0, 10)}.fsp`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setActiveMenu(null);
        } catch (err) {
            console.error('Failed to compress save file', err);
            alert('Failed to save project');
        }
    };

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const result = event.target?.result;
            try {
                // First try to read as UTF-8 text (legacy .json saves)
                if (result instanceof ArrayBuffer) {
                    try {
                        const text = new TextDecoder().decode(new Uint8Array(result));
                        const parsed = JSON.parse(text) as SaveFile;
                        loadProject(parsed);
                        return;
                    } catch (err) {
                        // Not plain text, try decompressing
                    }

                    try {
                        const decompressed = await decompress(result as ArrayBuffer);
                        const parsed = JSON.parse(decompressed) as SaveFile;
                        loadProject(parsed);
                        return;
                    } catch (err) {
                        console.error('Failed to decompress/load file', err);
                        alert('Failed to load project file');
                    }
                } else if (typeof result === 'string') {
                    const parsed = JSON.parse(result as string) as SaveFile;
                    loadProject(parsed);
                    return;
                }
            } catch (err) {
                console.error('Failed to load project file', err);
                alert('Failed to load project file');
            }
        };
        reader.readAsArrayBuffer(file);
        setActiveMenu(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            addItem({
                id: Math.random().toString(36).substr(2, 9),
                type: 'image',
                x: 100,
                y: 100,
                rotation: 0,
                stroke: 'transparent',
                strokeWidth: 0,
                fill: 'transparent',
                opacity: 1,
                draggable: true,
                width: 200,
                height: 200,
                src
            });
        };
        reader.readAsDataURL(file);
        setActiveMenu(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleRemoteImageInsert = () => {
        const url = prompt('Paste an image URL');
        if (!url) return;

        addItem({
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            x: 100,
            y: 100,
            rotation: 0,
            stroke: 'transparent',
            strokeWidth: 0,
            fill: 'transparent',
            opacity: 1,
            draggable: true,
            width: 200,
            height: 200,
            src: url.trim()
        });
        setActiveMenu(null);
    };

    const toggleMenu = (menu: string) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // Close menu when clicking outside (simple implementation: overlay or specific click handler would be better but this is MVP)
    const MenuItem = ({ label, onClick, shortcut, checked }: { label: string, onClick: () => void, shortcut?: string, checked?: boolean }) => (
        <div
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between min-w-[160px]"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
                setActiveMenu(null);
            }}
        >
            <div className="flex items-center">
                {checked !== undefined && (
                    <span className="w-4 mr-2 text-blue-400">{checked ? '✓' : ''}</span>
                )}
                <span>{label}</span>
            </div>
            {shortcut && <span className="text-gray-500 text-xs ml-4 my-auto">{shortcut}</span>}
        </div>
    );

    return (
        <div className="h-8 bg-gray-900 border-b border-gray-700 flex items-center px-2 text-sm text-gray-300 select-none relative z-50">
            {/* Hidden Inputs */}
            <input type="file" ref={fileInputRef} className="hidden" accept=".json,.fsp" onChange={handleLoad} />
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageInsert} />

            {/* Menus */}
            <div className="relative">
                <div
                    className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'file' ? 'bg-gray-700' : ''}`}
                    onClick={() => toggleMenu('file')}
                >
                    File
                </div>
                {activeMenu === 'file' && (
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                        <MenuItem label="New Project" onClick={() => setShowProjectInit(true)} />
                        {/* Project Init Modal for New Project */}
                        <ProjectConfigModal
                            isOpen={showProjectInit}
                            onClose={() => setShowProjectInit(false)}
                            onComplete={(config) => {
                                resetProject();
                                setFloorplanImage(config.floorplanImage);
                                updateFloorplan({ rotation: config.rotation });
                                updateFengShui(config.fengShui);
                                if (config.compassPosition) {
                                    updateCompass({ x: config.compassPosition.x, y: config.compassPosition.y });
                                }
                                setMode && setMode('edit');
                                setShowProjectInit(false);
                            }}
                        />
                        <MenuItem label="Open Project" onClick={() => fileInputRef.current?.click()} />
                        <MenuItem label="Save Project" onClick={handleSave} />
                        <MenuItem
                            label="Auto-save"
                            onClick={() => {
                                toggleAutoSave();
                            }}
                            checked={autoSave}
                        />
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem label="Configure Project" onClick={() => { setShowProjectConfig(true); }} />
                        <MenuItem label="Export as Image..." onClick={() => triggerExport()} />
                    </div>
                )}
            </div>

            <div className="relative">
                <div
                    className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'edit' ? 'bg-gray-700' : ''}`}
                    onClick={() => toggleMenu('edit')}
                >
                    Edit
                </div>
                {activeMenu === 'edit' && (
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                        <MenuItem label="Undo" onClick={undo} shortcut="Ctrl+Z" />
                        <MenuItem label="Redo" onClick={redo} shortcut="Ctrl+Y" />
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem label="Clone Object" onClick={cloneSelected} shortcut="Ctrl+D" />
                        <MenuItem label="Delete Selected" onClick={deleteSelected} shortcut="Del" />
                        <MenuItem label="Move Up" onClick={() => moveSelectedLayer('up')} shortcut="]" />
                        <MenuItem label="Move Down" onClick={() => moveSelectedLayer('down')} shortcut="[" />
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem label="Insert Local Image" onClick={() => imageInputRef.current?.click()} />
                        <MenuItem label="Insert Remote Image" onClick={handleRemoteImageInsert} />
                    </div>
                )}
            </div>

            <div className="relative">
                <div
                    className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'option' ? 'bg-gray-700' : ''}`}
                    onClick={() => toggleMenu('option')}
                >
                    Options
                </div>
                {activeMenu === 'option' && (
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                        <MenuItem label="About" onClick={() => alert('Feng Shui Plotter v0.1.0\nBuilt with React & Vite')} />

                        <div className="h-px bg-gray-700 my-1" />
                        <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Compass</div>

                        <div
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                updateCompass({ locked: !compass.locked });
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
                                onChange={(e) => updateCompass({ opacity: parseFloat(e.target.value) })}
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
                                onChange={(e) => updateCompass({ radius: parseFloat(e.target.value) })}
                                className="w-full accent-blue-500 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem
                            label="Keyboard Shortcuts..."
                            onClick={() => {
                                setShowShortcutConfig(true);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Click backdrop to close menu */}
            {activeMenu && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
            )}
            <ShortcutConfigModal
                isOpen={showShortcutConfig}
                onClose={() => setShowShortcutConfig(false)}
            />
        </div>
    );
};
