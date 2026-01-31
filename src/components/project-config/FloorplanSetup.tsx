import React, { useRef } from 'react';
import { Upload, ArrowDown } from 'lucide-react';
import { PopoverSlider } from '../common/PopoverSlider';

interface FloorplanSetupProps {
    floorplanImage: string | null;
    floorplanRotation: number;
    onRotationChange: (value: number) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FloorplanSetup: React.FC<FloorplanSetupProps> = ({
    floorplanImage,
    floorplanRotation,
    onRotationChange,
    onImageUpload
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6 flex flex-col">
            <div className="flex items-center justify-between shrink-0 h-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                        <Upload size={18} className="text-blue-400" />
                        Floorplan Setup
                    </h3>
                    {floorplanImage && (
                        <div className="flex items-center gap-2">
                            <PopoverSlider
                                value={floorplanRotation}
                                onChange={onRotationChange}
                                min={0}
                                max={360}
                                step={0.1}
                                bigStep={10}
                                unit="°"
                                presetsCols={3}
                                presetsMaxRows={4}
                                presets={[
                                    { label: '0', value: 0 },
                                    { label: '45', value: 45 },
                                    { label: '90', value: 90 },
                                    { label: '135', value: 135 },
                                    { label: '180', value: 180 },
                                    { label: '225', value: 225 },
                                    { label: '270', value: 270 },
                                    { label: '315', value: 315 }
                                ]}
                            />
                        </div>
                    )}
                </div>
                {floorplanImage && (
                    <div className="text-xs text-yellow-500 bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-800/50 hidden sm:block">
                        Hint: South facing UP
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
            />

            {!floorplanImage ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-gray-800/50 transition-all cursor-pointer group flex-1 flex flex-col items-center justify-center"
                >
                    <div className="bg-gray-800 p-4 rounded-full inline-flex mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-300 mb-1">Upload Floorplan</h4>
                    <p className="text-gray-500 text-sm">
                        Click to browse or drop file here (PNG, JPG)
                    </p>
                </div>
            ) : (
                <div className="space-y-4 flex flex-col flex-1 min-h-0 lg:max-h-[500px]">
                    <div className="relative group rounded-xl overflow-hidden bg-white border border-gray-800 flex-1 min-h-0">
                        <div className="absolute top-4 right-4 z-10 flex flex-col items-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-sm border border-gray-200">
                            <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-16 h-16 items-center justify-items-center">
                                <div className="col-start-2 row-start-1 text-gray-800 font-bold text-xs">S</div>
                                <div className="col-start-3 row-start-2 text-gray-800 font-bold text-xs">W</div>
                                <div className="col-start-1 row-start-2 text-gray-800 font-bold text-xs">E</div>
                                <div className="col-start-2 row-start-2 relative w-full h-full flex items-center justify-center">
                                    <div className="absolute w-[1px] h-full bg-gray-400"></div>
                                    <div className="absolute h-[1px] w-full bg-gray-400"></div>
                                </div>
                                <div className="col-start-2 row-start-3 flex flex-col items-center">
                                    <ArrowDown size={14} className="text-red-600 fill-red-600" />
                                    <span className="text-red-600 font-bold text-xs">N</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                                src={floorplanImage}
                                alt="Floorplan"
                                className="max-w-[70%] max-h-[70%] object-contain shadow-lg"
                                style={{
                                    transform: `rotate(${floorplanRotation}deg)`,
                                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            />
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Change Image
                        </button>
                    </div>

                    {/* Full-width rotation slider below preview (duplicate control for floorplanRotation) */}
                    <div className="w-full px-4">
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={0.1}
                            value={floorplanRotation}
                            onChange={(e) => onRotationChange(parseFloat(e.target.value))}
                            className="w-full"
                            aria-label="Floorplan rotation"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
