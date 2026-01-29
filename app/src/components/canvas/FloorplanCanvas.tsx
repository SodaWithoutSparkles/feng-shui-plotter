import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { useStore } from '../../store/useStore';
import { CompassOverlay } from '../overlay/CompassOverlay';
import { ShapeRenderer } from './ShapeRenderer';
import type { CanvasItem } from '../../types';

export const FloorplanCanvas: React.FC = () => {
    const floorplan = useStore((state) => state.floorplan);
    const objects = useStore((state) => state.objects);
    const compass = useStore((state) => state.compass);
    const selectedIds = useStore((state) => state.selectedIds);
    const selectItem = useStore((state) => state.selectItem);
    const updateItem = useStore((state) => state.updateItem);
    const addItem = useStore((state) => state.addItem);
    const activeTool = useStore((state) => state.activeTool);
    const colors = useStore((state) => state.colors);
    const setColors = useStore((state) => state.setColors);
    const isDropperActive = useStore((state) => state.isDropperActive);
    const setDropperActive = useStore((state) => state.setDropperActive);
    const toolSettings = useStore((state) => state.toolSettings);

    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [floorplanImg, setFloorplanImg] = useState<HTMLImageElement | null>(null);

    // Canvas dimensions - responsive to parent container
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<CanvasItem | null>(null);
    const [isAltPressed, setIsAltPressed] = useState(false);
    const [isPolylineMode, setIsPolylineMode] = useState(false);

    // Load floorplan image
    useEffect(() => {
        if (floorplan.imageSrc) {
            const img = new window.Image();
            img.src = floorplan.imageSrc;
            img.onload = () => {
                setFloorplanImg(img);
            };
        } else {
            setFloorplanImg(null);
        }
    }, [floorplan.imageSrc]);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Keyboard event listeners for Alt and Space
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt') {
                setIsAltPressed(true);
            }
            if (e.key === ' ' && activeTool === 'arrow' && isDrawing) {
                e.preventDefault();
                setIsPolylineMode(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt') {
                setIsAltPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [activeTool, isDrawing]);

    // Initial scale/position for the "camera"
    const [stagePos, setStagePos] = useState({ x: 0, y: 0, scale: 1 });

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        setStagePos({
            scale: newScale,
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    const handleMouseDown = (e: any) => {
        // Handle color picker
        if (isDropperActive) {
            const shape = e.target;
            if (shape && shape.attrs && (shape.attrs.stroke || shape.attrs.fill)) {
                const pickedColor = colors.active === 'stroke' ? shape.attrs.stroke : shape.attrs.fill;
                if (pickedColor) {
                    setColors({ [colors.active]: pickedColor });
                    setDropperActive(false);
                }
            }
            return;
        }

        if (activeTool === 'select') return;

        // Handle text tool
        if (activeTool === 'text') {
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();
            const transform = stage.getAbsoluteTransform().copy().invert();
            const localPos = transform.point(pos);

            const text = prompt('Enter text:');
            if (text) {
                const id = Math.random().toString(36).substr(2, 9);
                const newText: CanvasItem = {
                    id,
                    type: 'text',
                    x: localPos.x,
                    y: localPos.y,
                    text,
                    fontSize: toolSettings.fontSize,
                    fontFamily: toolSettings.fontFamily,
                    fontStyle: toolSettings.fontStyle,
                    fontWeight: toolSettings.fontWeight,
                    align: toolSettings.textAlign,
                    rotation: 0,
                    fill: colors.stroke,
                    opacity: 1,
                    draggable: true
                };
                addItem(newText);
            }
            return;
        }

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const transform = stage.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(pos);

        setIsDrawing(true);

        const id = Math.random().toString(36).substr(2, 9);

        let newShape: CanvasItem | null = null;

        switch (activeTool) {
            case 'rectangle':
                newShape = {
                    id,
                    type: 'rectangle',
                    x: localPos.x,
                    y: localPos.y,
                    width: 0,
                    height: 0,
                    rotation: 0,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
                    fill: colors.fill,
                    opacity: 1,
                    draggable: true
                };
                break;

            case 'ellipse':
                newShape = {
                    id,
                    type: 'ellipse',
                    x: localPos.x,
                    y: localPos.y,
                    radiusX: 0,
                    radiusY: 0,
                    rotation: 0,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
                    fill: colors.fill,
                    opacity: 1,
                    draggable: true
                };
                break;

            case 'line':
                newShape = {
                    id,
                    type: 'line',
                    x: 0,
                    y: 0,
                    points: [{ x: localPos.x, y: localPos.y }],
                    closed: false,
                    rotation: 0,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
                    fill: 'transparent',
                    opacity: 1,
                    draggable: true
                };
                break;

            case 'arrow':
                newShape = {
                    id,
                    type: 'arrow',
                    x: 0,
                    y: 0,
                    points: [{ x: localPos.x, y: localPos.y }, { x: localPos.x, y: localPos.y }],
                    pointerLength: 10,
                    pointerWidth: 10,
                    rotation: 0,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
                    fill: colors.stroke,
                    opacity: 1,
                    draggable: true
                };
                break;

            case 'star':
                newShape = {
                    id,
                    type: 'star',
                    x: localPos.x,
                    y: localPos.y,
                    numPoints: 5,
                    innerRadius: 0,
                    outerRadius: 0,
                    rotation: 0,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
                    fill: colors.fill,
                    opacity: 1,
                    draggable: true
                };
                break;
        }

        if (newShape) {
            setCurrentShape(newShape);
        }
    };

    const handleMouseMove = () => {
        if (!isDrawing || !currentShape) return;

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const transform = stage.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(pos);

        switch (currentShape.type) {
            case 'rectangle': {
                const rectShape = currentShape as Extract<CanvasItem, { type: 'rectangle' }>;
                let width = localPos.x - currentShape.x;
                let height = localPos.y - currentShape.y;

                // Alt key: constrain to square (1:1 aspect ratio)
                if (isAltPressed) {
                    const size = Math.max(Math.abs(width), Math.abs(height));
                    width = width >= 0 ? size : -size;
                    height = height >= 0 ? size : -size;
                }

                setCurrentShape({
                    ...rectShape,
                    width,
                    height
                });
                break;
            }

            case 'ellipse': {
                const ellipseShape = currentShape as Extract<CanvasItem, { type: 'ellipse' }>;
                let radiusX = Math.abs(localPos.x - currentShape.x);
                let radiusY = Math.abs(localPos.y - currentShape.y);

                // Alt key: constrain to circle (1:1 aspect ratio)
                if (isAltPressed) {
                    const radius = Math.max(radiusX, radiusY);
                    radiusX = radius;
                    radiusY = radius;
                }

                setCurrentShape({
                    ...ellipseShape,
                    radiusX,
                    radiusY
                });
                break;
            }

            case 'line': {
                const lineShape = currentShape as Extract<CanvasItem, { type: 'line' }>;
                let endX = localPos.x;
                let endY = localPos.y;

                // Alt key: constrain to horizontal or vertical line
                if (isAltPressed && lineShape.points.length > 0) {
                    const startPoint = lineShape.points[0];
                    const dx = Math.abs(endX - startPoint.x);
                    const dy = Math.abs(endY - startPoint.y);

                    if (dx > dy) {
                        endY = startPoint.y; // Horizontal
                    } else {
                        endX = startPoint.x; // Vertical
                    }
                }

                setCurrentShape({
                    ...lineShape,
                    points: [lineShape.points[0], { x: endX, y: endY }]
                });
                break;
            }

            case 'arrow': {
                const arrowShape = currentShape as Extract<CanvasItem, { type: 'arrow' }>;
                let endX = localPos.x;
                let endY = localPos.y;

                // Alt key: constrain to horizontal or vertical arrow
                if (isAltPressed && arrowShape.points.length > 0) {
                    const startPoint = arrowShape.points[0];
                    const dx = Math.abs(endX - startPoint.x);
                    const dy = Math.abs(endY - startPoint.y);

                    if (dx > dy) {
                        endY = startPoint.y; // Horizontal
                    } else {
                        endX = startPoint.x; // Vertical
                    }
                }

                // Update last point or add new point in polyline mode
                if (isPolylineMode) {
                    setCurrentShape({
                        ...arrowShape,
                        points: [...arrowShape.points, { x: endX, y: endY }]
                    });
                    setIsPolylineMode(false);
                } else {
                    const newPoints = [...arrowShape.points];
                    newPoints[newPoints.length - 1] = { x: endX, y: endY };
                    setCurrentShape({
                        ...arrowShape,
                        points: newPoints
                    });
                }
                break;
            }

            case 'star': {
                const starShape = currentShape as Extract<CanvasItem, { type: 'star' }>;
                const radius = Math.sqrt(
                    Math.pow(localPos.x - currentShape.x, 2) + Math.pow(localPos.y - currentShape.y, 2)
                );
                setCurrentShape({
                    ...starShape,
                    innerRadius: radius * 0.5,
                    outerRadius: radius
                });
                break;
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && currentShape) {
            // Only add shape if it has reasonable dimensions
            let shouldAdd = false;

            switch (currentShape.type) {
                case 'rectangle': {
                    const rectShape = currentShape as Extract<CanvasItem, { type: 'rectangle' }>;
                    shouldAdd = Math.abs(rectShape.width) > 5 && Math.abs(rectShape.height) > 5;
                    break;
                }
                case 'ellipse': {
                    const ellipseShape = currentShape as Extract<CanvasItem, { type: 'ellipse' }>;
                    shouldAdd = ellipseShape.radiusX > 5 && ellipseShape.radiusY > 5;
                    break;
                }
                case 'star': {
                    const starShape = currentShape as Extract<CanvasItem, { type: 'star' }>;
                    shouldAdd = starShape.outerRadius > 5;
                    break;
                }
                case 'line':
                case 'arrow': {
                    const lineShape = currentShape as Extract<CanvasItem, { type: 'line' | 'arrow' }>;
                    shouldAdd = lineShape.points.length >= 2;
                    break;
                }
            }

            if (shouldAdd) {
                addItem(currentShape);
            }
        }

        setIsDrawing(false);
        setCurrentShape(null);
    };

    const handleStageClick = (e: any) => {
        // Deselect when clicking on empty area
        if (e.target === e.target.getStage()) {
            selectItem(null);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full relative object-contain bg-gray-200 overflow-hidden">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleStageClick}
                scaleX={stagePos.scale}
                scaleY={stagePos.scale}
                x={stagePos.x}
                y={stagePos.y}
                draggable={activeTool === 'select' && !isDropperActive}
                ref={stageRef}
                style={{ cursor: isDropperActive ? 'crosshair' : 'default' }}
            >
                <Layer>
                    {/* Floorplan Image Layer */}
                    {floorplanImg && (
                        <KonvaImage
                            image={floorplanImg}
                            x={floorplan.x}
                            y={floorplan.y}
                            scaleX={floorplan.scale}
                            scaleY={floorplan.scale}
                            rotation={floorplan.rotation}
                            opacity={floorplan.opacity}
                            listening={false}
                        />
                    )}

                    {/* Objects Layer */}
                    {objects.map((item) => (
                        <ShapeRenderer
                            key={item.id}
                            item={item}
                            isSelected={selectedIds.includes(item.id)}
                            onSelect={() => selectItem(item.id)}
                            onChange={(updates) => updateItem(item.id, updates)}
                        />
                    ))}

                    {/* Current Drawing Shape */}
                    {currentShape && (
                        <ShapeRenderer
                            item={currentShape}
                            isSelected={false}
                            onSelect={() => { }}
                            onChange={() => { }}
                        />
                    )}
                </Layer>
            </Stage>

            {compass.visible && (
                <div className="absolute top-4 right-4 pointer-events-none">
                    <CompassOverlay rotation={compass.rotation} />
                </div>
            )}
        </div>
    );
};
