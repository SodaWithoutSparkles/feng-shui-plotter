import React, { Suspense, lazy, useState } from 'react';
import { useStore } from '../store/useStore';
import { Upload, FilePlus, RefreshCcw } from 'lucide-react';
import { decompress, decompressFromBase64 } from '../utils/compress';
import type { SaveFile } from '../types';

const ProjectConfigModal = lazy(() => import('./ProjectConfigModal').then((m) => ({ default: m.ProjectConfigModal })));

export const WelcomeScreen: React.FC = () => {
    const setMode = useStore((state) => state.setMode);
    const loadProject = useStore((state) => state.loadProject);
    const setFloorplanImage = useStore((state) => state.setFloorplanImage);
    const updateFloorplan = useStore((state) => state.updateFloorplan);
    const updateFengShui = useStore((state) => state.updateFengShui);
    const updateCompass = useStore((state) => state.updateCompass);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAutoSave, setHasAutoSave] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

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
            }
        } catch (e) {
            console.error('Failed to recover project', e);
            alert('Failed to recover project. The autosave file found might be corrupted.');
        }
    };

    const handleSaveFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const result = event.target?.result;
            try {
                // Try as UTF-8 text first (legacy .json saves)
                if (result instanceof ArrayBuffer) {
                    try {
                        const text = new TextDecoder().decode(new Uint8Array(result));
                        const json = JSON.parse(text);
                        loadProject(json);
                        return;
                    } catch (err) {
                        // Not plain text, try decompress
                    }

                    try {
                        const decompressed = await decompress(result as ArrayBuffer);
                        const json = JSON.parse(decompressed);
                        loadProject(json);
                        return;
                    } catch (err) {
                        console.error("Failed to parse save file", err);
                        alert("Invalid save file format");
                    }
                } else if (typeof result === 'string') {
                    const json = JSON.parse(result as string);
                    loadProject(json);
                    return;
                }
            } catch (err) {
                console.error("Failed to parse save file", err);
                alert("Invalid save file format");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleSaveFile(file);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
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
                <label className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-green-500 cursor-pointer group">
                    <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                        <Upload size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Load Save File</h2>
                    <p className="text-gray-500 text-center">Continue working on an existing save file (.json or compressed .fsp).</p>
                    <input
                        type="file"
                        accept=".json,.fsp"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {isModalOpen && (
                <Suspense fallback={null}>
                    <ProjectConfigModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onComplete={(config) => {
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

            {/* Recover Card */}
            {hasAutoSave && (
                <button
                    onClick={handleRecover}
                    className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-orange-500 group md:col-span-2 lg:col-span-1"
                >
                    <div className="bg-orange-100 p-4 rounded-full mb-4 group-hover:bg-orange-200 transition-colors">
                        <RefreshCcw size={48} className="text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Recover Auto-save</h2>
                    <p className="text-gray-500 text-center">Restore the last auto-saved session.</p>
                </button>
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
