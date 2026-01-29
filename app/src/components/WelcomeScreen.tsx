import React from 'react';
import { useStore } from '../store/useStore';
import { Upload, FilePlus } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
    const setMode = useStore((state) => state.setMode);
    const loadProject = useStore((state) => state.loadProject);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // TODO: Validate JSON schema here
                loadProject(json);
            } catch (err) {
                console.error("Failed to parse save file", err);
                alert("Invalid save file format");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Feng Shui Plotter</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
                {/* New Project Card */}
                <button
                    onClick={() => setMode('edit')}
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
                    <p className="text-gray-500 text-center">Continue working on an existing .json save file.</p>
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>
        </div>
    );
};
