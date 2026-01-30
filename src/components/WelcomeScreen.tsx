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
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const checkAutoSave = () => {
            const saved = localStorage.getItem('autosave_project');
            if (saved) setHasAutoSave(true);
        };
        checkAutoSave();
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

        </div>
    );
};
