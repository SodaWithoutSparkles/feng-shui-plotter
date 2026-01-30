// Deprecated, see src/components/canvas/CompassShape.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface CompassOverlayProps {
    rotation: number;
}

// 24 Mountains: Clockwise from North (0° Bearing)
// Sequence starting from North (0°):
// 0°: Zi (子)
// 15°: Gui (癸)
// 30°: Chou (丑)
// ...
// 345° (-15°): Ren (壬)
const MOUNTAINS_24 = [
    '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙',
    '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬'
];

// 8 Directions: Clockwise from North
const DIRECTIONS_8 = [
    '北', '東北', '東', '東南', '南', '西南', '西', '西北'
];

const RING_WIDTH = 26; // Fixed pixel width for rings
const OUTER_PADDING = 4;

export const CompassOverlay: React.FC<CompassOverlayProps> = ({ rotation }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(256);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setSize(Math.min(width, height));
            }
        };

        const observer = new ResizeObserver(updateSize);
        observer.observe(containerRef.current);

        // Initial size
        updateSize();

        return () => observer.disconnect();
    }, []);

    // Calculate Geometry
    const { center, rings } = useMemo(() => {
        const c = size / 2;
        const r4 = c - OUTER_PADDING; // Outer edge
        const r3 = r4 - RING_WIDTH;   // Boundary Outer/Mtn
        const r2 = r3 - RING_WIDTH;   // Boundary Mtn/Dir
        const r1 = r2 - RING_WIDTH;   // Boundary Dir/Inner

        return {
            center: c,
            rings: {
                outer: { outer: r4, inner: r3 },
                mountains: { outer: r3, inner: r2 },
                directions: { outer: r2, inner: r1 },
                inner: r1
            }
        };
    }, [size]);

    // Helpers for Polar Coordinates
    // CSS Angle: 0=Right, 90=Bottom(North), 180=Left, 270=Top
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div
            ref={containerRef}
            className="w-64 h-64 rounded-full shadow-2xl overflow-hidden relative"
            style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-out',
                backgroundColor: 'rgba(255,255,255,0.7)', // 70% transparent white
                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
            }}
        >
            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
                {/* Background */}
                <circle cx={center} cy={center} r={rings.outer.outer} fill="#FDF5E6" stroke="#8B4513" strokeWidth="2" />

                {/* --- Outer Ring: Degrees (0 at Bottom) --- */}
                {/* 0 deg Bearing -> 90 deg CSS */}
                <g className="font-sans text-[8px] font-semibold fill-gray-900">
                    {/* Ticks every 5 degrees */}
                    {Array.from({ length: 72 }).map((_, i) => {
                        const tickIsMajor = i % 3 === 0; // Every 15 deg
                        const bearing = i * 5;
                        const angle = (bearing + 90) % 360;

                        // Draw tick
                        const rStart = rings.outer.outer - (tickIsMajor ? 6 : 3);
                        const rEnd = rings.outer.outer;
                        const p1 = polarToCartesian(center, center, rStart, angle);
                        const p2 = polarToCartesian(center, center, rEnd, angle);

                        return (
                            <line
                                key={`tick-${i}`}
                                x1={p1.x} y1={p1.y}
                                x2={p2.x} y2={p2.y}
                                stroke="#5C4033"
                                strokeWidth={tickIsMajor ? 1.5 : 0.5}
                            />
                        );
                    })}

                    {/* Text every 15 degrees */}
                    {Array.from({ length: 24 }).map((_, i) => {
                        const bearing = i * 15;
                        const angle = (bearing + 90) % 360; // Position angle on circle

                        // Text Rotation:
                        // Bottom (90 deg pos) -> upright (0 rot) => 90 - 90 = 0.
                        const textRot = angle - 90;

                        const pos = polarToCartesian(center, center, rings.outer.inner + 8, angle);

                        return (
                            <text
                                key={`deg-${i}`}
                                x={pos.x} y={pos.y}
                                textAnchor="middle" dominantBaseline="middle"
                                transform={`rotate(${textRot}, ${pos.x}, ${pos.y})`}
                                className="select-none"
                            >
                                {bearing}
                            </text>
                        );
                    })}
                </g>
                <circle cx={center} cy={center} r={rings.outer.inner} fill="none" stroke="#8B4513" strokeWidth="1" />

                {/* --- 3rd Ring: 24 Mountains --- */}
                <g className="font-serif text-[10px] font-bold fill-gray-900">
                    {MOUNTAINS_24.map((char, i) => {
                        // i=0 is Zi (0 deg bearing).
                        // Segment spans 15 deg.
                        // Center angle: 90 + i*15.
                        const bearing = i * 15;
                        const angle = (bearing + 90) % 360;
                        const textRot = angle - 90;
                        const pos = polarToCartesian(center, center, (rings.mountains.inner + rings.mountains.outer) / 2, angle);

                        // Separator lines
                        const sepAngle = angle - 7.5;
                        const sepP1 = polarToCartesian(center, center, rings.mountains.inner, sepAngle);
                        const sepP2 = polarToCartesian(center, center, rings.mountains.outer, sepAngle);

                        return (
                            <React.Fragment key={`mtn-${i}`}>
                                <line x1={sepP1.x} y1={sepP1.y} x2={sepP2.x} y2={sepP2.y} stroke="#D2B48C" strokeWidth="1" />
                                <text
                                    x={pos.x} y={pos.y}
                                    textAnchor="middle" dominantBaseline="central"
                                    transform={`rotate(${textRot}, ${pos.x}, ${pos.y})`}
                                    className="select-none"
                                >
                                    {char}
                                </text>
                            </React.Fragment>
                        );
                    })}
                </g>
                <circle cx={center} cy={center} r={rings.mountains.inner} fill="none" stroke="#8B4513" strokeWidth="1" />

                {/* --- 2nd Ring: 8 Directions --- */}
                <g className="font-serif text-[12px] font-bold fill-black">
                    {DIRECTIONS_8.map((char, i) => {
                        // i=0 is North (0 deg bearing).
                        // Segment spans 45 deg.
                        const bearing = i * 45;
                        const angle = (bearing + 90) % 360;
                        const textRot = angle - 90;
                        const pos = polarToCartesian(center, center, (rings.directions.inner + rings.directions.outer) / 2, angle);

                        // Separators
                        const sepAngle = angle - 22.5;
                        const sepP1 = polarToCartesian(center, center, rings.directions.inner, sepAngle);
                        const sepP2 = polarToCartesian(center, center, rings.directions.outer, sepAngle);

                        return (
                            <React.Fragment key={`dir-${i}`}>
                                <line x1={sepP1.x} y1={sepP1.y} x2={sepP2.x} y2={sepP2.y} stroke="#D2B48C" strokeWidth="1" />
                                <text
                                    x={pos.x} y={pos.y}
                                    textAnchor="middle" dominantBaseline="central"
                                    transform={`rotate(${textRot}, ${pos.x}, ${pos.y})`}
                                    className="select-none"
                                    fill={i % 2 === 0 ? '#8B0000' : 'black'} // Cardinal dirs in dark red
                                >
                                    {char}
                                </text>
                            </React.Fragment>
                        );
                    })}
                </g>
                <circle cx={center} cy={center} r={rings.directions.inner} fill="none" stroke="#8B4513" strokeWidth="2" />

                {/* --- Inner Ring Area (Void/Crosshair) --- */}
                {/* Crosshair */}
                <line x1={center} y1={0} x2={center} y2={size} stroke="red" strokeWidth="1.5" opacity="0.8" />
                <line x1={0} y1={center} x2={size} y2={center} stroke="red" strokeWidth="1.5" opacity="0.8" />

                {/* Center dot */}
                <circle cx={center} cy={center} r={3} fill="red" />
            </svg>
        </div>
    );
};
