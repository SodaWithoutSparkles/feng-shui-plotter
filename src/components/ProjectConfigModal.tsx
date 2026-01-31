import React, { useState, useEffect } from 'react';
import { X, Compass } from 'lucide-react';
import { genFengShui, getMountainFacingFromAngle, getPeriodFromYear, MOUNTAINS_24, getMountainIndex } from '../utils/FengShui';
import type { FengShuiData } from '../types';
import { FloorplanSetup } from './project-config/FloorplanSetup';
import { FengShuiConfig } from './project-config/FengShuiConfig';
import { ChartPreview } from './project-config/ChartPreview';

interface ProjectConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (config: {
        floorplanImage: string;
        rotation: number;
        fengShui: FengShuiData;
        compassPosition?: { x: number, y: number };
        floorplanPosition?: { x: number, y: number };
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
    const [, setFloorplanDimensions] = useState<{ width: number, height: number } | null>(null);

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

        const newFS = genFengShui(
            period,
            mfData.waterStar,
            mfData.waterReversed,
            mfData.mountainStar,
            mfData.mountainReversed,
            pStar
        );

        // Update purple calculated_at to Jan 1 of annualYear
        // And ensure view stays consistent with selected year
        setFengShui({
            ...newFS,
            purples: {
                ...newFS.purples,
                calculated_at: new Date(annualYear, 0, 1),
                viewMode: 'manual',
                manualYear: annualYear
            }
        });

        setFacingInfo({
            main: mfData.mainFacing,
            sub: mfData.subFacing
        });

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
            compassPosition: { x: 0, y: 0 },
            floorplanPosition: { x: 0, y: 0 }
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
                            {initialData ? 'Edit Project Configuration' : 'New Project Configuration'}
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

                        <FloorplanSetup
                            floorplanImage={floorplanImage}
                            floorplanRotation={floorplanRotation}
                            onRotationChange={setFloorplanRotation}
                            onImageUpload={handleImageUpload}
                        />

                        <div className="space-y-6 flex flex-col">
                            <FengShuiConfig
                                houseYear={houseYear}
                                period={period}
                                facingAngle={facingAngle}
                                facingInfo={facingInfo}
                                sittingName={sittingName}
                                annualYear={annualYear}
                                purpleStar={purpleStar}
                                currentYear={currentYear}
                                onHouseYearChange={handleHouseYearChange}
                                onPeriodChange={setPeriod}
                                onFacingAngleChange={setFacingAngle}
                                onAnnualYearChange={setAnnualYear}
                            />

                            <ChartPreview
                                fengShui={fengShui}
                                onUpdateFengShui={updateFengShuiManually}
                            />
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
                        {initialData ? 'Update Project' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};
