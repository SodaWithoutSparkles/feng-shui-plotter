import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, RotateCw, Calendar, Compass, ArrowUp, ArrowDown } from 'lucide-react';
import { FlystarVisualization } from './FlystarVisualization';
import { genFengShui, getMountainFacingFromAngle, getPeriodFromYear, MOUNTAINS_24, getMountainIndex } from '../utils/FengShui';
import type { FengShuiData } from '../types';
import { PopoverSlider } from './common/PopoverSlider';

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
    // --- State ---
    const [floorplanImage, setFloorplanImage] = useState<string | null>(null);
    const [floorplanDimensions, setFloorplanDimensions] = useState<{ width: number, height: number } | null>(null);

    // Decoupled rotations
    const [floorplanRotation, setFloorplanRotation] = useState(0); // Visual rotation of the image
    const [facingAngle, setFacingAngle] = useState(180); // Magnetic facing angle for calculation (Default 180 S)

    // Time & Stars
    const currentYear = new Date().getFullYear();
    const [houseYear, setHouseYear] = useState<number>(currentYear);
    const [period, setPeriod] = useState(9);
    const [annualYear, setAnnualYear] = useState<number>(currentYear);
    const [purpleStar, setPurpleStar] = useState<number>(9);

    const [fengShui, setFengShui] = useState<FengShuiData>(
        genFengShui(9, 1, false, 1, false, 1)
    );
    const [facingInfo, setFacingInfo] = useState<{ main: string, sub: string | null }>({ main: '', sub: null });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Calculators ---

    // Calculate Purple Star from Year
    const calcPurple = (year: number) => {
        let star = (11 - (year % 9)) % 9;
        if (star === 0) star = 9;
        setPurpleStar(star);
        return star;
    };

    // --- Initialization ---
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFloorplanImage(initialData.floorplanImage || null);
                setFloorplanRotation(initialData.rotation);

                // Try to infer period from passed data or default
                if (initialData.fengShui?.blacks?.start) {
                    setPeriod(initialData.fengShui.blacks.start);
                }

                setFengShui(initialData.fengShui);
            } else {
                // New Project Defaults
                setFloorplanRotation(0);
                setFacingAngle(180); // South
                const now = new Date();
                setHouseYear(now.getFullYear());
                setAnnualYear(now.getFullYear());
                const p = getPeriodFromYear(now.getFullYear());
                setPeriod(p);
                calcPurple(now.getFullYear());
            }
        }
    }, [isOpen, initialData]);

    // Main Feng Shui Calculation
    // Triggered when relevant inputs change
    useEffect(() => {
        // Calculate Mountain/Facing
        const mfData = getMountainFacingFromAngle(facingAngle, period);

        // Calculate Purple
        const pStar = calcPurple(annualYear);

        setFengShui(genFengShui(
            period,
            mfData.waterStar,
            mfData.waterReversed,
            mfData.mountainStar,
            mfData.mountainReversed,
            pStar
        ));

        setFacingInfo({
            main: mfData.mainFacing,
            sub: mfData.subFacing
        });

        // Update purple calculated_at to Jan 1 of annualYear
        setFengShui(prev => ({
            ...prev,
            purples: {
                ...prev.purples,
                calculated_at: new Date(annualYear, 0, 1)
            }
        }));

    }, [facingAngle, period, annualYear]);

    // Handle House Year Change -> Update Period
    const handleHouseYearChange = (val: number) => {
        setHouseYear(val);
        const p = getPeriodFromYear(val);
        setPeriod(p);
    };

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
                        const resized = canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png');
                        setFloorplanDimensions({ width, height });
                        setFloorplanImage(resized);
                        return;
                    }
                }
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
            rotation: floorplanRotation, // Visual rotation
            fengShui,
            compassPosition: floorplanDimensions ? {
                x: floorplanDimensions.width / 2,
                y: floorplanDimensions.height / 2
            } : undefined
        });
        onClose();
    };

    const sittingIndex = (getMountainIndex(facingAngle) + 12) % 24;
    const sittingName = MOUNTAINS_24[sittingIndex];

    const updateFengShuiManually = (updates: Partial<FengShuiData>) => {
        setFengShui(prev => ({ ...prev, ...updates }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 text-gray-100 rounded-xl shadow-2xl w-full xl:max-w-7xl max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <Compass className="text-blue-500" />
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            New Project Configuration
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                        {/* LEFT COLUMN: Floorplan */}
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
                                                onChange={setFloorplanRotation}
                                                min={0} max={360}
                                                step={0.1}
                                                bigStep={10}
                                                unit="°"
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
                                onChange={handleImageUpload}
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
                                    {/* Image Preview & Rotation Tools */}
                                    <div className="relative group rounded-xl overflow-hidden bg-white border border-gray-800 flex-1 min-h-0">
                                        {/* Compass Hint Overlay */}
                                        <div className="absolute top-4 right-4 z-10 flex flex-col items-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-sm border border-gray-200">
                                            {/* Cross Layout for Compass */}
                                            <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-16 h-16 items-center justify-items-center">
                                                {/* South (Top) */}
                                                <div className="col-start-2 row-start-1 text-gray-800 font-bold text-xs">S</div>

                                                {/* West (Right) & East (Left) - Reversed because S is Up? 
                                                    Normal Map: N up, E right.
                                                    Rotated 180 (S up): E becomes Left, W becomes right.
                                                    Let's verify:
                                                    N
                                                  W   E
                                                    S
                                                    
                                                    Rotate 180:
                                                    S
                                                  E   W
                                                    N
                                                    
                                                    So Left is E, Right is W.
                                                */}
                                                <div className="col-start-3 row-start-2 text-gray-800 font-bold text-xs">W</div>
                                                <div className="col-start-1 row-start-2 text-gray-800 font-bold text-xs">E</div>

                                                {/* Center Lines */}
                                                <div className="col-start-2 row-start-2 relative w-full h-full flex items-center justify-center">
                                                    <div className="absolute w-[1px] h-full bg-gray-400"></div>
                                                    <div className="absolute h-[1px] w-full bg-gray-400"></div>
                                                </div>

                                                {/* North (Bottom) - RED */}
                                                <div className="col-start-2 row-start-3 flex flex-col items-center">
                                                    {/* Pointing Down to North */}
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

                                    {/* Rotation Controls removed - moved to header */}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Feng Shui */}
                        <div className="space-y-6 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 shrink-0">
                                <Compass size={18} className="text-purple-400" />
                                Feng Shui Calculation
                            </h3>

                            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 space-y-6 shrink-0">

                                {/* 1. House Year & Period */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Left Side: House Year */}
                                        <div className="space-y-1 border-r border-gray-700 pr-4">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                                House Completed
                                            </label>
                                            <div className="relative">
                                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="number"
                                                    value={houseYear}
                                                    onChange={(e) => handleHouseYearChange(parseInt(e.target.value))}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Right Side: Period Grid */}
                                        <div className="space-y-1 pl-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                                Yun (Period)
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPeriod(p)}
                                                        className={`h-8 rounded text-sm font-medium transition-all ${period === p
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-gray-700/50"></div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* 2. Facing Angle */}
                                    <div className="space-y-3 border-r border-gray-700 pr-4">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                            Facing Direction
                                        </label>

                                        <div className="flex items-center gap-4">
                                            {/* Popover Slider Component */}
                                            <PopoverSlider
                                                value={facingAngle}
                                                onChange={setFacingAngle}
                                                min={0}
                                                max={360}
                                                unit="°"
                                                presets={[
                                                    { label: 'N (0°)', value: 0 },
                                                    { label: 'E (90°)', value: 90 },
                                                    { label: 'S (180°)', value: 180 },
                                                    { label: 'W (270°)', value: 270 }
                                                ]}
                                            />

                                            {/* Big Text Display */}
                                            {facingInfo.main && (
                                                <div className="text-2xl font-bold font-serif text-gray-200 whitespace-nowrap scale-90 origin-left">
                                                    <span className="text-gray-500 mr-1 text-lg">坐</span>
                                                    <span className="text-blue-300">{sittingName}</span>
                                                    <span className="text-gray-500 mx-1 text-lg">向</span>
                                                    <span className="text-red-300">{facingInfo.main}</span>
                                                    {facingInfo.sub && (
                                                        <span className="text-base ml-1 text-gray-500">
                                                            (兼<span className="text-yellow-500">{facingInfo.sub}</span>)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Click the degree number to adjust.
                                        </p>
                                    </div>

                                    {/* 3. Annual Star */}
                                    <div className="space-y-3 pl-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                            Annual Star (Purple)
                                        </label>
                                        <div className="flex gap-4 items-center h-10 justify-start">
                                            <div className="w-28 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center p-2">
                                                <PopoverSlider
                                                    value={annualYear}
                                                    onChange={setAnnualYear}
                                                    min={1900}
                                                    max={2100}
                                                    step={1}
                                                    bigStep={10}
                                                    hideSlider={true}
                                                    presets={[
                                                        { label: `Now (${currentYear})`, value: currentYear },
                                                        { label: `Next (${currentYear + 1})`, value: currentYear + 1 }
                                                    ]}

                                                />
                                            </div>
                                            <div className="text-sm text-gray-400 whitespace-nowrap">
                                                Purple: <span className="text-purple-400 font-bold text-lg ml-1">{purpleStar}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Visualization Box */}
                            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl flex-1 flex flex-col min-h-0">
                                <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-700 flex justify-between items-center shrink-0">
                                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Chart Preview</span>
                                </div>
                                <div className="p-6 flex justify-center bg-gray-900 flex-1 overflow-auto">
                                    <FlystarVisualization
                                        fengShui={fengShui}
                                        updateFengShui={updateFengShuiManually}
                                        showControls={true}
                                        showYear={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 px-6 py-4 flex justify-end gap-3 border-t border-gray-700 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleComplete}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};
