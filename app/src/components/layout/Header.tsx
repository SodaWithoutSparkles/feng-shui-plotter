import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { SaveFile } from '../../types';

export const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Store actions
    const resetProject = useStore(state => state.resetProject);
    const loadProject = useStore(state => state.loadProject);
    const undo = useStore(state => state.undo);
    const redo = useStore(state => state.redo);
    const cloneSelected = useStore(state => state.cloneSelected);
    const deleteSelected = useStore(state => state.deleteSelected);
    const moveSelectedLayer = useStore(state => state.moveSelectedLayer);
    const toggleFlyStar = useStore(state => state.toggleFlyStar);
    const addItem = useStore(state => state.addItem);
    const autoSave = useStore(state => state.autoSave);
    const toggleAutoSave = useStore(state => state.toggleAutoSave);
    const setShowProjectConfig = useStore(state => state.setShowProjectConfig);

    // Store state getters for save - fetch individually to prevent re-render loops
    const floorplan = useStore(state => state.floorplan);
    const objects = useStore(state => state.objects);
    const fengShui = useStore(state => state.fengShui);
    const compass = useStore(state => state.compass);
    const version = useStore(state => state.version);

    // Auto-save effect
    useEffect(() => {
        if (autoSave) {
            const timer = setTimeout(() => {
                const saveData: SaveFile = {
                    floorplan,
                    objects,
                    fengShui,
                    compass,
                    version,
                    timestamp: new Date()
                };
                localStorage.setItem('autosave_project', JSON.stringify(saveData));
                console.log('Auto-saved'); // Optional confirmation
            }, 3000); // 3 sec debounce
            return () => clearTimeout(timer);
        }
    }, [floorplan, objects, fengShui, compass, version, autoSave]);

    const handleSave = () => {
        const saveFile: SaveFile = {
            version,
            timestamp: new Date(),
            floorplan,
            objects,
            fengShui,
            compass
        };

        const blob = new Blob([JSON.stringify(saveFile, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-${new Date().toISOString().slice(0, 10)}.fsp`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setActiveMenu(null);
    };

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string) as SaveFile;
                loadProject(data);
            } catch (err) {
                alert('Failed to load project file');
            }
        };
        reader.readAsText(file);
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
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md">
                        <MenuItem label="New Project" onClick={resetProject} />
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
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md">
                        <MenuItem label="Undo" onClick={undo} shortcut="Ctrl+Z" />
                        <MenuItem label="Redo" onClick={redo} shortcut="Ctrl+Y" />
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem label="Clone Object" onClick={cloneSelected} shortcut="Ctrl+D" />
                        <MenuItem label="Delete Selected" onClick={deleteSelected} shortcut="Del" />
                        <MenuItem label="Move Up" onClick={() => moveSelectedLayer('up')} shortcut="]" />
                        <MenuItem label="Move Down" onClick={() => moveSelectedLayer('down')} shortcut="[" />
                        <div className="h-px bg-gray-700 my-1" />
                        <MenuItem label="Insert Image" onClick={() => imageInputRef.current?.click()} />
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
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md">
                        <MenuItem label="About" onClick={() => alert('Feng Shui Plotter v0.1.0\nBuilt with React & Vite')} />
                    </div>
                )}
            </div>

            {/* Click backdrop to close menu */}
            {activeMenu && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
            )}
        </div>
    );
};
