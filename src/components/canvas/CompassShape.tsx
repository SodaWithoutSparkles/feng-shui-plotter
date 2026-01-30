import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Group, Line, Image } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';

const MOUNTAINS_24 = [
    '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙',
    '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬'
];

const DIRECTIONS_8 = [
    '北', '東北', '東', '東南', '南', '西南', '西', '西北'
];

// Generate SVG string once - static geometry optimization
const createCompassSvg = () => {
    // Standardize calculation on a high-resolution base for quality scaling
    const R = 500;
    const Center = 500;
    const rw = R * 0.2; // 20% ring width
    const rings = {
        outer: R,
        mountains: R - rw,
        directions: R - 2 * rw,
        inner: R - 3 * rw
    };

    // Helper for polar to cartesian centered at (Center, Center)
    const p2c = (r: number, deg: number) => {
        const rad = (deg * Math.PI) / 180;
        return {
            x: Center + r * Math.cos(rad),
            y: Center + r * Math.sin(rad)
        };
    };

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${R * 2}" height="${R * 2}" viewBox="0 0 ${R * 2} ${R * 2}">`;

    // 1. Background
    // stroke-width 2
    svg += `<circle cx="${Center}" cy="${Center}" r="${rings.outer}" fill="#FDF5E6" stroke="#8B4513" stroke-width="2" opacity="1"/>`;

    // 2. Ticks & Degree Text (Outer Ring)
    for (let i = 0; i < 72; i++) {
        const tickIsMajor = i % 3 === 0;
        const bearing = i * 5;
        const angle = (bearing + 90) % 360;

        const rStart = rings.outer - (tickIsMajor ? rw / 3 : rw / 6);
        const rEnd = rings.outer;
        const p1 = p2c(rStart, angle);
        const p2 = p2c(rEnd, angle);

        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#5C4033" stroke-width="${tickIsMajor ? 1.5 : 0.5}" />`;
    }

    // Degree Text
    for (let i = 0; i < 24; i++) {
        const bearing = i * 15;
        const angle = (bearing + 90) % 360;
        const pos = p2c(rings.outer - rw / 2 + 2, angle);
        const rot = angle + 90;

        // font-size 30 (~0.06 of 500)
        svg += `<text x="${pos.x}" y="${pos.y}" 
            font-family="sans-serif" font-size="30" fill="#333" 
            text-anchor="middle" dominant-baseline="central"
            transform="rotate(${rot}, ${pos.x}, ${pos.y})">${bearing}</text>`;
    }

    // 3. Mountains Ring
    svg += `<circle cx="${Center}" cy="${Center}" r="${rings.mountains}" fill="none" stroke="#8B4513" stroke-width="1" />`;

    for (let i = 0; i < 24; i++) {
        const char = MOUNTAINS_24[i];
        const bearing = i * 15;
        const angle = (bearing + 90) % 360;

        // Separators
        const sepAngle = angle - 7.5;
        const p1 = p2c(rings.directions, sepAngle);
        const p2 = p2c(rings.mountains, sepAngle);
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#D2B48C" stroke-width="1" />`;

        // Text
        const rMid = (rings.mountains + rings.directions) / 2;
        const pos = p2c(rMid, angle);
        const rot = angle + 90;

        // font-size 40 (~0.08 of 500)
        svg += `<text x="${pos.x}" y="${pos.y}" 
            font-family="serif" font-weight="bold" font-size="40" fill="#111" 
            text-anchor="middle" dominant-baseline="central"
            transform="rotate(${rot}, ${pos.x}, ${pos.y})">${char}</text>`;
    }

    // 4. Directions Ring
    svg += `<circle cx="${Center}" cy="${Center}" r="${rings.directions}" fill="none" stroke="#8B4513" stroke-width="1" />`;

    for (let i = 0; i < 8; i++) {
        const char = DIRECTIONS_8[i];
        const bearing = i * 45;
        const angle = (bearing + 90) % 360;

        // Separators
        const sepAngle = angle - 22.5;
        const p1 = p2c(rings.inner, sepAngle);
        const p2 = p2c(rings.directions, sepAngle);
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#D2B48C" stroke-width="1" />`;

        // Text
        const rMid = (rings.directions + rings.inner) / 2;
        const pos = p2c(rMid, angle);
        const rot = angle + 90;
        const color = i % 2 === 0 ? '#8B0000' : 'black';

        // font-size 50 (~0.1 of 500)
        svg += `<text x="${pos.x}" y="${pos.y}" 
            font-family="serif" font-weight="bold" font-size="50" fill="${color}" 
            text-anchor="middle" dominant-baseline="central"
            transform="rotate(${rot}, ${pos.x}, ${pos.y})">${char}</text>`;
    }

    // 5. Inner Ring & Crosshair
    svg += `<circle cx="${Center}" cy="${Center}" r="${rings.inner}" fill="none" stroke="#8B4513" stroke-width="2" />`;

    // Crosshair lines relative to Center.
    // -radius to radius
    svg += `<line x1="${Center}" y1="${Center - R}" x2="${Center}" y2="${Center + R}" stroke="red" stroke-width="1.5" opacity="0.6" />`;
    svg += `<line x1="${Center - R}" y1="${Center}" x2="${Center + R}" y2="${Center}" stroke="red" stroke-width="1.5" opacity="0.6" />`;
    svg += `<circle cx="${Center}" cy="${Center}" r="3" fill="red" />`;

    svg += '</svg>';
    return svg;
};

const COMPASS_SVG_STRING = createCompassSvg();
const COMPASS_SVG_URL = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(COMPASS_SVG_STRING)))}`;

interface CompassShapeProps {
    x: number;
    y: number;
    radius: number;
    rotation: number;
    opacity: number;
    mode: 'hidden' | 'visible' | 'interactive' | 'projections';
    onChange: (attrs: { x: number; y: number; radius?: number }) => void;
    onTransformStart?: () => void;
    onTransform?: () => void;
    onTransformEnd?: () => void;
}

export const CompassShape = React.forwardRef<any, CompassShapeProps>(({
    x, y, radius, rotation, opacity, mode, onChange, onTransformStart, onTransform, onTransformEnd
}, ref) => {
    const groupRef = useRef<any>(null);
    const innerVisualRef = useRef<any>(null);

    useImperativeHandle(ref, () => groupRef.current);

    // Load static image
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
        const img = new window.Image();
        // SVG image rendering is purely on CPU/GPU as texture, 
        // avoiding recalculation of hundreds of primitives in Konva scene graph
        img.src = COMPASS_SVG_URL;
        img.onload = () => setImage(img);
    }, []);

    useEffect(() => {
        const groupNode = groupRef.current;
        const innerNode = innerVisualRef.current;
        if (!groupNode || !innerNode) return;

        const originalGetClientRect = groupNode.getClientRect?.bind(groupNode);

        groupNode.getClientRect = (config?: any) => {
            if (!innerVisualRef.current) {
                return originalGetClientRect ? originalGetClientRect(config) : { x: 0, y: 0, width: 0, height: 0 };
            }
            return innerVisualRef.current.getClientRect({
                ...config,
                relativeTo: groupNode
            });
        };

        return () => {
            if (originalGetClientRect) {
                groupNode.getClientRect = originalGetClientRect;
            }
        };
    }, []);

    // Projections logic (Dynamic)
    const showProjections = mode === 'projections' || mode === 'interactive';
    const isDraggable = mode === 'interactive';

    // Calculate inner ring radius for projections connection point
    // Matches SVG logic: inner = radius * 0.4 (1 - 3*0.2)
    const innerRadius = radius * 0.4;

    // Helper for projections
    const p2c = (r: number, deg: number) => {
        const rad = (deg * Math.PI) / 180;
        return {
            x: r * Math.cos(rad),
            y: r * Math.sin(rad)
        };
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        onChange({
            x: e.target.x(),
            y: e.target.y()
        });
    };

    return (
        <Group
            ref={groupRef}
            x={x}
            y={y}
            rotation={rotation}
            opacity={opacity}
            draggable={isDraggable}
            onDragEnd={handleDragEnd}
            onTransformStart={onTransformStart}
            onTransform={onTransform}
            onTransformEnd={onTransformEnd}
        >
            <Group ref={innerVisualRef} name="compass-inner-visual">
                {/* Optimized Compass Face */}
                <Image
                    image={image || undefined}
                    x={-radius}
                    y={-radius}
                    width={radius * 2}
                    height={radius * 2}
                    // Ensure hit detection works on the image pixels (non-transparent mostly)
                    listening={mode !== 'hidden'}
                />
            </Group>

            {/* Dynamic Projections */}
            {showProjections && (
                <Group name="compass-projections">
                    {Array.from({ length: 24 }).map((_, i) => {
                        const bearing = i * 15;
                        const angle = (bearing + 90) % 360;
                        const sepAngle = angle - 7.5;

                        const start = p2c(innerRadius, sepAngle);
                        const end = p2c(radius * 3, sepAngle);

                        return (
                            <Line
                                key={`proj-${i}`}
                                points={[start.x, start.y, end.x, end.y]}
                                stroke="red"
                                strokeWidth={1}
                                dash={[5, 5]}
                                opacity={0.5}
                                listening={false} // Optimization: don't catch events on projection lines
                            />
                        );
                    })}
                </Group>
            )}
        </Group>
    );
});
