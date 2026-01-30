import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, RotateCw } from 'lucide-react';
import { FlystarVisualization } from './FlystarVisualization';
import { genFengShui } from '../utils/FengShui';
import type { FengShuiData } from '../types';

interface ProjectConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (config: {
        floorplanImage: string;
        rotation: number;
        fengShui: FengShuiData;
        compassPosition?: { x: number, y: number };
    }) => void;
    initialData?: {
        floorplanImage: string;
        rotation: number;
        fengShui: FengShuiData;
    };
}

export const ProjectConfigModal: React.FC<ProjectConfigModalProps> = ({
    isOpen,
    onClose,
    onComplete,
    initialData
}) => {
    const [floorplanImage, setFloorplanImage] = useState<string | null>(null);
    const [floorplanDimensions, setFloorplanDimensions] = useState<{ width: number, height: number } | null>(null);
    const [rotation, setRotation] = useState(0);
    const [fengShui, setFengShui] = useState<FengShuiData>(
        genFengShui(1, 1, false, 1, false, 1)
    );

    useEffect(() => {
        if (isOpen && initialData) {
            setFloorplanImage(initialData.floorplanImage || null);
            setRotation(initialData.rotation);
            setFengShui(initialData.fengShui);
        }
    }, [isOpen, initialData]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                const maxSize = 1080;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Use png for better quality on floorplans usually, or match file type if possible
                        // Assuming png/jpeg.
                        const resized = canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png');
                        setFloorplanDimensions({ width, height });
                        setFloorplanImage(resized);
                        return;
                    }
                }

                // No resize needed or context failed
                setFloorplanDimensions({ width, height });
                setFloorplanImage(result);
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    };

    const handleComplete = () => {
        if (!floorplanImage) {
            alert('Please upload a floorplan image');
            return;
        }

        onComplete({
            floorplanImage,
            rotation,
            fengShui,
            compassPosition: floorplanDimensions ? {
                x: floorplanDimensions.width / 2,
                y: floorplanDimensions.height / 2
            } : undefined
        });
        onClose();
    };

    const updateFengShui = (updates: Partial<FengShuiData>) => {
        setFengShui(prev => ({ ...prev, ...updates }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">New Project Configuration</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Floorplan Upload & Preview */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Floorplan Image</h3>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            {!floorplanImage && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <Upload size={20} />
                                        Upload Image
                                    </button>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Upload a floorplan image (PNG, JPG, etc.)
                                    </p>
                                </div>
                            )}

                            {/* Rotation Control */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <RotateCw size={16} className="mr-2" />
                                    Rotation: {rotation}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    step="1"
                                    value={rotation}
                                    onChange={(e) => setRotation(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setRotation((rotation - 90 + 360) % 360)}
                                        className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                    >
                                        -90°
                                    </button>
                                    <button
                                        onClick={() => setRotation((rotation + 90) % 360)}
                                        className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                    >
                                        +90°
                                    </button>
                                    <button
                                        onClick={() => setRotation(0)}
                                        className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Floorplan Preview */}
                            {floorplanImage && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 w-full text-left hover:border-blue-400 transition-colors"
                                    title="Click to replace image"
                                >
                                    <div className="bg-gray-800 text-white px-3 py-2 text-sm font-semibold flex items-center justify-between">
                                        <span>Preview</span>
                                        <span className="text-xs text-blue-200">Click to replace</span>
                                    </div>
                                    <div className="p-4 flex items-center justify-center min-h-[300px]">
                                        <img
                                            src={floorplanImage}
                                            alt="Floorplan preview"
                                            className="max-w-full max-h-[400px] object-contain"
                                            style={{
                                                transform: `rotate(${rotation}deg)`,
                                                transition: 'transform 0.2s ease'
                                            }}
                                        />
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Right Column: Feng Shui Configuration */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Feng Shui Configuration</h3>

                            {/* Flystar Visualization */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-800 text-white px-3 py-2 text-sm font-semibold">
                                    Flying Star Chart
                                </div>
                                <div className="p-4">
                                    <FlystarVisualization
                                        fengShui={fengShui}
                                        updateFengShui={updateFengShui}
                                        showControls={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t border-gray-300">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleComplete}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};
