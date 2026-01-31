import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Compass, Grid, FolderOpen, Home, RefreshCcw } from 'lucide-react';
import { FlystarVisualization } from '../FlystarVisualization';
import { decompress, decompressFromBase64 } from '../../utils/compress';
import type { SaveFile } from '../../types';

const FloorplanCanvas = lazy(() => import('../canvas/FloorplanCanvas').then((m) => ({ default: m.FloorplanCanvas })));

export const ViewModeLayout: React.FC = () => {
    // Store
    const showFlyStar = useStore((state) => state.showFlyStar);
    const toggleFlyStar = useStore((state) => state.toggleFlyStar);
    const compass = useStore((state) => state.compass);
    const updateCompass = useStore((state) => state.updateCompass);
    const fengShui = useStore((state) => state.fengShui);
    const floorplan = useStore((state) => state.floorplan);
    const loadProject = useStore((state) => state.loadProject);
    const setProjectName = useStore((state) => state.setProjectName);
    const triggerHomeView = useStore((state) => state.triggerHomeView);

    // Local state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasAutoSave, setHasAutoSave] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    // Build info
    const rawBuildCommit = (import.meta as any)?.env?.VITE_BUILD_COMMIT;
    const rawBuildTime = (import.meta as any)?.env?.VITE_BUILD_TIME;
    const buildCommit = rawBuildCommit ? String(rawBuildCommit) : null;
    const buildTimeRaw = rawBuildTime ? String(rawBuildTime) : null;
    let buildCommitShort = 'local';
    let formattedBuildTime = 'local build';
    if (buildCommit) {
        buildCommitShort = buildCommit.slice(0, 7);
    }
    if (buildTimeRaw) {
        try {
            const d = new Date(buildTimeRaw);
            formattedBuildTime = d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
        } catch (e) {
            formattedBuildTime = buildTimeRaw;
        }
    }

    useEffect(() => {
        const saved = localStorage.getItem('autosave_project');
        if (saved) setHasAutoSave(true);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const buffer = await file.arrayBuffer();
        try {
            let json: SaveFile;
            try {
                const text = new TextDecoder().decode(new Uint8Array(buffer));
                json = JSON.parse(text) as SaveFile;
            } catch {
                const decompressed = await decompress(buffer);
                json = JSON.parse(decompressed) as SaveFile;
            }
            loadProject(json);
            setProjectName(json.projectName || file.name.replace(/\.[^/.]+$/, ''));
        } catch (err) {
            console.error(err);
            alert("Invalid file");
        }
    };

    const handleSaveFile = async (file: File) => {
        const buffer = await file.arrayBuffer();
        try {
            let json: SaveFile;
            try {
                const text = new TextDecoder().decode(new Uint8Array(buffer));
                json = JSON.parse(text) as SaveFile;
            } catch {
                const decompressed = await decompress(buffer);
                json = JSON.parse(decompressed) as SaveFile;
            }
            loadProject(json);
            setProjectName(json.projectName || file.name.replace(/\.[^/.]+$/, ''));
        } catch (err) {
            console.error(err);
            alert("Invalid file");
        }
    };

    const handleRecover = async () => {
        const saved = localStorage.getItem('autosave_project');
        if (saved) {
            const jsonStr = await decompressFromBase64(saved);
            const project = JSON.parse(jsonStr) as SaveFile;
            loadProject(project);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget === e.target) {
            setIsDraggingFile(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        const isSupported = file.name.toLowerCase().endsWith('.fsp') || file.name.toLowerCase().endsWith('.json');
        if (!isSupported) {
            alert('Please drop a .fsp or .json save file.');
            return;
        }
        handleSaveFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Custom toggle for View Mode: only hidden -> visible -> projections
    const handleCompassToggle = () => {
        const modes = ['hidden', 'visible', 'projections'] as const;
        let currentMode = compass.mode;
        // If current mode is 'interactive' (from edit mode), treat it as 'visible'
        if (currentMode === 'interactive') currentMode = 'visible';

        const currentIndex = modes.indexOf(currentMode as any);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];

        updateCompass({ mode: nextMode, visible: nextMode !== 'hidden' });
    };

    const hasProject = !!floorplan.imageSrc;

    if (!hasProject) {
        return (
            <div
                className="flex flex-col items-center justify-center h-screen bg-gray-50 relative"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <h1 className="text-4xl font-bold mb-2 text-gray-800">View Only Mode</h1>
                <p className="text-gray-500 mb-8">View saved Feng Shui floorplans without editing.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full px-4">
                    {/* Recover Card */}
                    <button
                        onClick={hasAutoSave ? handleRecover : undefined}
                        disabled={!hasAutoSave}
                        aria-disabled={!hasAutoSave}
                        className={`flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent group ${hasAutoSave ? 'hover:border-orange-500' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                    >
                        <div className={`p-4 rounded-full mb-4 transition-colors ${hasAutoSave ? 'bg-orange-100 group-hover:bg-orange-200' : 'bg-gray-100'}`}>
                            <RefreshCcw size={48} className={hasAutoSave ? 'text-orange-600' : 'text-gray-500'} />
                        </div>
                        <h2 className={`text-2xl font-semibold mb-2 ${hasAutoSave ? 'text-gray-800' : 'text-gray-500'}`}>Recover Auto-save</h2>
                        <p className={`text-center ${hasAutoSave ? 'text-gray-500' : 'text-gray-400'}`}>Restore the last auto-saved session.</p>
                    </button>

                    {/* Open File Card */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-green-500 cursor-pointer group"
                    >
                        <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                            <FolderOpen size={48} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Open Save File</h2>
                        <p className="text-gray-500 text-center">Open a .fsp or .json save file.</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".fsp,.json"
                            onChange={handleFileUpload}
                        />
                    </button>
                </div>

                {isDraggingFile && (
                    <div className="absolute inset-0 bg-blue-600/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none z-50">
                        <div className="bg-white/90 px-6 py-4 rounded-lg shadow-lg text-blue-700 font-semibold">
                            Drop .fsp or .json to open
                        </div>
                    </div>
                )}

                {/* Footer: author and build info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-gray-500 px-4">
                    <div className="opacity-90">
                        By <span className="font-semibold">SodaWithoutSparkles</span>
                        {/* github logo and link to proj */}
                        <a href='https://github.com/SodaWithoutSparkles/feng-shui-plotter' className="ml-2 inline-block align-middle" aria-label="GitHub repository">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                            </svg>
                        </a>
                    </div>

                    <div className="opacity-80" title={buildTimeRaw ? new Date(buildTimeRaw).toString() : undefined}>
                        {buildCommit ? (
                            <>
                                <a href='https://github.com/SodaWithoutSparkles/feng-shui-plotter'><span className="font-mono">{buildCommitShort}</span></a>
                                <span className="mx-2">•</span>
                                <span>{formattedBuildTime}</span>
                            </>
                        ) : (
                            <a href='https://github.com/SodaWithoutSparkles/feng-shui-plotter'><span>Development build</span></a>
                        )}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
            {/* Left Toolbar */}
            <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4 shadow-xl z-20 flex-shrink-0">
                <button
                    onClick={handleCompassToggle}
                    className={`p-3 rounded-lg transition-colors ${compass.mode !== 'hidden' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                    title="Toggle Compass"
                >
                    <Compass size={24} />
                </button>

                <button
                    onClick={toggleFlyStar}
                    className={`p-3 rounded-lg transition-colors ${showFlyStar ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                    title="Toggle Fly Star Chart"
                >
                    <Grid size={24} />
                </button>

                <button
                    onClick={triggerHomeView}
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
                    title="Home / Reset View"
                >
                    <Home size={24} />
                </button>

                <div className="flex-1" />

                {/* Add button to open another file */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
                    title="Open File"
                >
                    <FolderOpen size={24} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".fsp,.json"
                    onChange={handleFileUpload}
                />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative bg-gray-500 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200">
                    <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-gray-700">Loading view...</div>}>
                        <FloorplanCanvas readOnly />
                    </Suspense>
                </div>

                {/* Overlays */}
                {showFlyStar && (
                    <div className="absolute top-0 left-0 z-10 bg-white/90 p-4 rounded-br-lg shadow-lg pointer-events-none origin-top-left">
                        <FlystarVisualization fengShui={fengShui} showControls={false} />
                    </div>
                )}
            </div>
        </div>
    );
};
