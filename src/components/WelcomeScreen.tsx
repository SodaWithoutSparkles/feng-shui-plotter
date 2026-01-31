import React, { Suspense, lazy, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Upload, FilePlus, RefreshCcw } from 'lucide-react';
import { decompress, decompressFromBase64 } from '../utils/compress';
import type { SaveFile } from '../types';
import { createDefaultProjectName } from '../utils/projectName';

const ProjectConfigModal = lazy(() => import('./ProjectConfigModal').then((m) => ({ default: m.ProjectConfigModal })));

export const WelcomeScreen: React.FC = () => {
    const setMode = useStore((state) => state.setMode);
    const loadProject = useStore((state) => state.loadProject);
    const setFloorplanImage = useStore((state) => state.setFloorplanImage);
    const updateFloorplan = useStore((state) => state.updateFloorplan);
    const updateFengShui = useStore((state) => state.updateFengShui);
    const updateCompass = useStore((state) => state.updateCompass);
    const setProjectName = useStore((state) => state.setProjectName);
    const setSaveFileName = useStore((state) => state.setSaveFileName);
    const setFileHandle = useStore((state) => state.setFileHandle);
    const setLastSavedAt = useStore((state) => state.setLastSavedAt);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAutoSave, setHasAutoSave] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [screenWarning, setScreenWarning] = useState<'none' | 'small' | 'very-small'>('none');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Build info injected at build time by CI (Vite exposes VITE_ prefixed vars on import.meta.env)
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
            // toLocaleString will format according to the user's timezone
            formattedBuildTime = d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
        } catch (e) {
            formattedBuildTime = buildTimeRaw;
        }
    }

    React.useEffect(() => {
        const checkAutoSave = () => {
            const saved = localStorage.getItem('autosave_project');
            if (saved) setHasAutoSave(true);
        };
        checkAutoSave();

        const checkSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (Math.min(w, h) < 620) {
                setScreenWarning('very-small');
            } else if (w < 830 || h < 764) {
                setScreenWarning('small');
            } else {
                setScreenWarning('none');
            }
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const handleRecover = async () => {
        try {
            const saved = localStorage.getItem('autosave_project');
            if (saved) {
                const jsonStr = await decompressFromBase64(saved);
                const project = JSON.parse(jsonStr) as SaveFile;
                loadProject(project);
                setProjectName(project.projectName ?? createDefaultProjectName());
                setSaveFileName(null);
                setFileHandle(null);
                setLastSavedAt(null);
            }
        } catch (e) {
            console.error('Failed to recover project', e);
            alert('Failed to recover project. The autosave file found might be corrupted.');
        }
    };

    const parseTimestamp = (timestamp?: SaveFile['timestamp']) => {
        if (!timestamp) return null;
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const time = date.getTime();
        return Number.isNaN(time) ? null : time;
    };

    const parseSaveFile = async (file: File) => {
        const buffer = await file.arrayBuffer();
        try {
            const text = new TextDecoder().decode(new Uint8Array(buffer));
            return JSON.parse(text) as SaveFile;
        } catch (err) {
            const decompressed = await decompress(buffer);
            return JSON.parse(decompressed) as SaveFile;
        }
    };

    const handleSaveFile = async (file: File, handle: FileSystemFileHandle | null = null) => {
        try {
            const json = await parseSaveFile(file);
            loadProject(json);
            setProjectName(json.projectName ?? file.name.replace(/\.[^/.]+$/, '') ?? createDefaultProjectName());
            setSaveFileName(file.name);
            setFileHandle(handle);
            setLastSavedAt(parseTimestamp(json.timestamp));
        } catch (err) {
            console.error("Failed to parse save file", err);
            alert("Invalid save file format");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleSaveFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleOpenPicker = async () => {
        try {
            if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
                const [handle] = await (window as any).showOpenFilePicker({
                    types: [{ description: 'Feng Shui Plotter Save', accept: { 'application/json': ['.fsp', '.json'] } }],
                    multiple: false
                });
                if (!handle) return;
                const file = await handle.getFile();
                await handleSaveFile(file, handle);
                return;
            }
            fileInputRef.current?.click();
        } catch (err) {
            console.error('Failed to open project file', err);
            alert('Failed to open project file');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
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

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-gray-50 relative"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Feng Shui Plotter</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                {/* Recover Card */}
                <button
                    onClick={hasAutoSave ? handleRecover : undefined}
                    disabled={!hasAutoSave}
                    aria-disabled={!hasAutoSave}
                    className={`flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent group ${hasAutoSave ? 'hover:border-orange-500' : 'opacity-50 cursor-not-allowed pointer-events-none'
                        }`}
                >
                    <div
                        className={`p-4 rounded-full mb-4 transition-colors ${hasAutoSave ? 'bg-orange-100 group-hover:bg-orange-200' : 'bg-gray-100'
                            }`}
                    >
                        <RefreshCcw size={48} className={hasAutoSave ? 'text-orange-600' : 'text-gray-500'} />
                    </div>
                    <h2 className={`text-2xl font-semibold mb-2 ${hasAutoSave ? 'text-gray-800' : 'text-gray-500'}`}>Recover Auto-save</h2>
                    <p className={`text-center ${hasAutoSave ? 'text-gray-500' : 'text-gray-400'}`}>Restore the last auto-saved session.</p>
                </button>

                {/* New Project Card */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-blue-500 group"
                >
                    <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                        <FilePlus size={48} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">New Project</h2>
                    <p className="text-gray-500 text-center">Start a new floorplan annotation from scratch.</p>

                    <a
                        href="/?mode=view"
                        target='_blank'
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
                    >
                        Or try View Only Mode
                    </a>
                </button>

                {/* Load Project Card */}
                <button
                    onClick={handleOpenPicker}
                    className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-green-500 cursor-pointer group"
                >
                    <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                        <Upload size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Load Save File</h2>
                    <p className="text-gray-500 text-center">Continue working on an existing save file (.json or compressed .fsp).</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,.fsp"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </button>
            </div>

            {isModalOpen && (
                <Suspense fallback={null}>
                    <ProjectConfigModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onComplete={(config) => {
                            setProjectName(createDefaultProjectName());
                            setSaveFileName(null);
                            setFileHandle(null);
                            setLastSavedAt(null);
                            setFloorplanImage(config.floorplanImage);
                            updateFloorplan({ rotation: config.rotation });
                            updateFengShui(config.fengShui);
                            if (config.compassPosition) {
                                updateCompass({ x: config.compassPosition.x, y: config.compassPosition.y });
                            }
                            setMode('edit');
                        }}
                    />
                </Suspense>
            )}

            {isDraggingFile && (
                <div className="absolute inset-0 bg-blue-600/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
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

            {screenWarning !== 'none' && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full ${screenWarning === 'very-small' ? 'border-4 border-red-500' : 'border-4 border-yellow-500'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            {screenWarning === 'very-small' ? (
                                <span className="text-red-600 mr-2">⚠️ Screen Too Small</span>
                            ) : (
                                <span className="text-yellow-600 mr-2">⚠️ Small Screen Detected</span>
                            )}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {screenWarning === 'very-small'
                                ? "This device's screen is too small for the editor. Editing will be extremely difficult. To continue working or viewing your project, please switch to View Only Mode."
                                : "The screen size is smaller than recommended (830x764). You may experience layout issues."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.href = '/?mode=view'}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                Switch to View Only Mode
                            </button>
                            <button
                                onClick={() => setScreenWarning('none')}
                                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                {screenWarning === 'very-small' ? 'Try Editing Anyway (Discouraged)' : 'Continue Editing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
