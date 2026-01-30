import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { SaveFile } from '../../types';
import { compressToBase64 } from '../../utils/compress';
import { createDefaultProjectName } from '../../utils/projectName';
import { sanitizeFilename, ensureSaveExtension, buildDefaultSaveName, parseTimestamp, parseSaveFile, writeSaveFileToHandle, downloadSaveFile } from '../../utils/saveProject';
import { ShortcutConfigModal } from '../common/ShortcutConfigModal';
import { ProjectConfigModal } from '../ProjectConfigModal';
import { HelpModal } from '../help/HelpModal';
import type { HelpSectionId } from '../help/sections';

export const Header: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showShortcutConfig, setShowShortcutConfig] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [helpSectionId, setHelpSectionId] = useState<HelpSectionId>('tools');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [showSaveAsModal, setShowSaveAsModal] = useState(false);
    const [saveAsProjectName, setSaveAsProjectName] = useState('');
    const [saveAsFileName, setSaveAsFileName] = useState('');

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
    const projectName = useStore(state => state.projectName);
    const setProjectName = useStore(state => state.setProjectName);
    const saveFileName = useStore(state => state.saveFileName);
    const setSaveFileName = useStore(state => state.setSaveFileName);
    const fileHandle = useStore(state => state.fileHandle);
    const setFileHandle = useStore(state => state.setFileHandle);
    const setLastSavedAt = useStore(state => state.setLastSavedAt);
    const lastSavedAt = useStore(state => state.lastSavedAt);
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

    const supportsFileSystemAccess = typeof window !== 'undefined' && 'showSaveFilePicker' in window;

    useEffect(() => {
        if (!isEditingName) {
            setNameDraft(projectName);
        }
    }, [projectName, isEditingName]);

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
                    projectName,
                    // include user's preferred filename so it can be recovered from autosave
                    saveFileName: saveFileName ?? undefined,
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
    }, [floorplan, objects, fengShui, compass, version, projectName, saveFileName, autoSave]);


    const lastSavedProjectNameRef = useRef(projectName);

    useEffect(() => {
        // Update snapshot of the project name when the project is saved or loaded
        lastSavedProjectNameRef.current = projectName;
    }, [lastSavedAt]);

    const hasNameChanged = projectName.trim() !== (lastSavedProjectNameRef.current?.trim() ?? '');

    const handleSave = async () => {
        try {
            const saveFile: SaveFile = {
                version,
                projectName,
                // persist the user's preferred filename in the save file
                saveFileName: saveFileName ?? undefined,
                timestamp: new Date(),
                floorplan,
                objects,
                fengShui,
                compass
            };

            if (fileHandle) {
                await writeSaveFileToHandle(fileHandle, saveFile);
                setSaveFileName((fileHandle as any).name);
                setLastSavedAt(Date.now());
                setActiveMenu(null);
                return;
            }

            if (supportsFileSystemAccess) {
                setActiveMenu(null);
                openSaveAsModal();
                return;
            }

            // No File System Access API — prefer the user's previously chosen filename if available
            const filename = saveFileName ? ensureSaveExtension(saveFileName) : ensureSaveExtension(sanitizeFilename(projectName.trim()) || buildDefaultSaveName(projectName));
            await downloadSaveFile(filename, saveFile);
            setFileHandle(null);
            setSaveFileName(filename);
            setLastSavedAt(Date.now());
            setActiveMenu(null);
        } catch (err) {
            console.error('Failed to save project', err);
            alert('Failed to save project');
        }
    };

    const handleSaveAs = async () => {
        try {
            setActiveMenu(null);
            openSaveAsModal();
        } catch (err) {
            console.error('Failed to save project as', err);
            alert('Failed to save project');
        }
    };

    const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const parsed = await parseSaveFile(file);
            loadProject(parsed);
            setFileHandle(null);
            const preferredName = parsed.saveFileName ?? file.name;
            setSaveFileName(preferredName);
            setProjectName(parsed.projectName ?? file.name.replace(/\.[^/.]+$/, '') ?? createDefaultProjectName());
            setLastSavedAt(parseTimestamp(parsed.timestamp));

            // If the File System Access API is available, prompt the user to pick a handle
            // so future saves can write in-place. This is optional — ignore cancellation.
            if (supportsFileSystemAccess) {
                try {
                    const handle = await (window as any).showSaveFilePicker({
                        suggestedName: preferredName,
                        types: [{ description: 'Feng Shui Plotter Save', accept: { 'application/json': ['.fsp', '.json'] } }]
                    });
                    if (handle) {
                        setFileHandle(handle);
                        setSaveFileName(handle.name);
                    }
                } catch (err) {
                    // user cancelled or permission denied — fine to ignore
                }
            }
        } catch (err) {
            console.error('Failed to load project file', err);
            alert('Failed to load project file');
        }

        setActiveMenu(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleOpenProject = async () => {
        try {
            if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
                const [handle] = await (window as any).showOpenFilePicker({
                    types: [{ description: 'Feng Shui Plotter Save', accept: { 'application/json': ['.fsp', '.json'] } }],
                    multiple: false
                });
                if (!handle) return;
                const file = await handle.getFile();
                const parsed = await parseSaveFile(file);
                loadProject(parsed);
                setFileHandle(handle);
                // prefer the internal preferred filename if present
                setSaveFileName(parsed.saveFileName ?? file.name);
                setProjectName(parsed.projectName ?? file.name.replace(/\.[^/.]+$/, '') ?? createDefaultProjectName());
                setLastSavedAt(parseTimestamp(parsed.timestamp));
                setActiveMenu(null);
                return;
            }
            fileInputRef.current?.click();
            setActiveMenu(null);
        } catch (err) {
            console.error('Failed to open project file', err);
            alert('Failed to open project file');
        }
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

    const openSaveAsModal = () => {
        const suggestedName = saveFileName || buildDefaultSaveName(projectName);
        setSaveAsProjectName(projectName || createDefaultProjectName());
        setSaveAsFileName(suggestedName);
        setShowSaveAsModal(true);
    };

    const confirmSaveAs = async () => {
        const nextProjectName = saveAsProjectName.trim() || createDefaultProjectName();
        const nextFilename = ensureSaveExtension(sanitizeFilename(saveAsFileName.trim()) || buildDefaultSaveName(nextProjectName));
        setProjectName(nextProjectName);
        setSaveFileName(nextFilename);

        const saveFile: SaveFile = {
            version,
            projectName: nextProjectName,
            // include chosen filename inside the save file for later recovery
            saveFileName: nextFilename,
            timestamp: new Date(),
            floorplan,
            objects,
            fengShui,
            compass
        };

        try {
            if (supportsFileSystemAccess) {
                try {
                    const handle = await (window as any).showSaveFilePicker({
                        suggestedName: nextFilename,
                        types: [{ description: 'Feng Shui Plotter Save', accept: { 'application/json': ['.fsp', '.json'] } }]
                    });
                    await writeSaveFileToHandle(handle, saveFile);
                    setFileHandle(handle);
                    setSaveFileName(handle.name);
                    setLastSavedAt(Date.now());
                } catch (err) {
                    await downloadSaveFile(nextFilename, saveFile);
                    setFileHandle(null);
                    setLastSavedAt(Date.now());
                }
            } else {
                await downloadSaveFile(nextFilename, saveFile);
                setFileHandle(null);
                setLastSavedAt(Date.now());
            }
            setShowSaveAsModal(false);
        } catch (err) {
            console.error('Failed to save project', err);
            alert('Failed to save project');
        }
    };

    const commitProjectName = () => {
        const trimmed = nameDraft.trim();
        if (!trimmed) {
            const fallback = createDefaultProjectName();
            setProjectName(fallback);
            setNameDraft(fallback);
        } else {
            setProjectName(trimmed);
        }
        setIsEditingName(false);
    };

    const cancelProjectName = () => {
        setIsEditingName(false);
        setNameDraft(projectName);
    };

    // Close menu when clicking outside (simple implementation: overlay or specific click handler would be better but this is MVP)
    const MenuItem = ({ label, onClick, shortcut, checked, disabled }: { label: string, onClick: () => void, shortcut?: string, checked?: boolean, disabled?: boolean }) => (
        <div
            className={`px-4 py-2 flex justify-between min-w-[160px] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 cursor-pointer'}`}
            onClick={(e) => {
                e.stopPropagation();
                if (disabled) return;
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
                        <MenuItem label="Open Project" onClick={handleOpenProject} />
                        <MenuItem
                            label={supportsFileSystemAccess ? 'Save Project (in-place)' : 'Save Project'}
                            onClick={handleSave}
                            disabled={!hasNameChanged}
                        />
                        <MenuItem label="Save Project As..." onClick={handleSaveAs} />
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

            <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 flex items-center max-w-[480px] w-full justify-center px-4">
                {isEditingName ? (
                    <input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        onBlur={commitProjectName}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                commitProjectName();
                            }
                            if (e.key === 'Escape') {
                                cancelProjectName();
                            }
                        }}
                        className="bg-gray-800 border border-gray-600 text-gray-100 text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[240px]"
                        autoFocus
                        aria-label="Project name"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="px-3 py-1 rounded text-gray-200 hover:bg-gray-800 transition-colors truncate max-w-full"
                        title="Click to rename project"
                    >
                        {projectName}
                    </button>
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

            <div className="relative">
                <div
                    className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'help' ? 'bg-gray-700' : ''}`}
                    onClick={() => toggleMenu('help')}
                >
                    Help
                </div>
                {activeMenu === 'help' && (
                    <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                        <MenuItem
                            label="Tools"
                            onClick={() => {
                                setHelpSectionId('tools');
                                setShowHelp(true);
                            }}
                        />
                        <MenuItem
                            label="Colors"
                            onClick={() => {
                                setHelpSectionId('colors');
                                setShowHelp(true);
                            }}
                        />
                        <MenuItem
                            label="Multi-function panel"
                            onClick={() => {
                                setHelpSectionId('panel');
                                setShowHelp(true);
                            }}
                        />
                        <MenuItem
                            label="FengShui"
                            onClick={() => {
                                setHelpSectionId('fengshui');
                                setShowHelp(true);
                            }}
                        />
                        <MenuItem
                            label="Compass"
                            onClick={() => {
                                setHelpSectionId('compass');
                                setShowHelp(true);
                            }}
                        />
                        <MenuItem
                            label="Images"
                            onClick={() => {
                                setHelpSectionId('images');
                                setShowHelp(true);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Click backdrop to close menu */}
            {activeMenu && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
            )}
            {showSaveAsModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Save Project As</h2>
                            <button
                                className="text-gray-300 hover:text-white transition-colors"
                                onClick={() => setShowSaveAsModal(false)}
                                aria-label="Close save as"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Project name</label>
                                <input
                                    value={saveAsProjectName}
                                    onChange={(e) => setSaveAsProjectName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Project name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">File name</label>
                                <input
                                    value={saveAsFileName}
                                    onChange={(e) => setSaveAsFileName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="filename.fsp"
                                />
                                <p className="text-xs text-gray-400">Use .fsp for compressed saves or .json for legacy format.</p>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600"
                                onClick={() => setShowSaveAsModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500"
                                onClick={confirmSaveAs}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ShortcutConfigModal
                isOpen={showShortcutConfig}
                onClose={() => setShowShortcutConfig(false)}
            />
            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                initialSectionId={helpSectionId}
            />
        </div>
    );
};
