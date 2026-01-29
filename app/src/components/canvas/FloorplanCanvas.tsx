import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useStore } from '../../store/useStore';
import { CompassShape } from './CompassShape';
import { ShapeRenderer } from './ShapeRenderer';
import type { CanvasItem } from '../../types';

export const FloorplanCanvas: React.FC = () => {
    const floorplan = useStore((state) => state.floorplan);
    const updateFloorplan = useStore((state) => state.updateFloorplan);
    const objects = useStore((state) => state.objects);
    const compass = useStore((state) => state.compass);
    const updateCompass = useStore((state) => state.updateCompass);
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
    const exportTrigger = useStore((state) => state.exportTrigger);


    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const compassRef = useRef<any>(null);
    const floorplanRef = useRef<any>(null);
    const lastCompassRotation = useRef(0);
    const lastCompassCenter = useRef({ x: 0, y: 0 });
    const lastCompassRadius = useRef(0);
    const trRef = useRef<any>(null);
    const [floorplanImg, setFloorplanImg] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (exportTrigger > 0 && stageRef.current) {
            // Find transformer and detach it temporarily for clean export
            const transformerConfig = trRef.current?.nodes();
            trRef.current?.nodes([]);

            // Capture stage as a data URL
            const dataUri = stageRef.current.toDataURL({ pixelRatio: 2 });

            // Create an image from the captured data URL so we can add
            // a white background and a 20px margin/border before saving
            const img = new window.Image();
            img.src = dataUri;

            img.onload = () => {
                const margin = 20; // px margin around the exported image

                const canvas = document.createElement('canvas');
                canvas.width = img.width + margin * 2;
                canvas.height = img.height + margin * 2;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Fill white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the captured image centered with margin
                ctx.drawImage(img, margin, margin);

                // Draw a subtle black border around the image
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.strokeRect(margin - 1, margin - 1, img.width + 2, img.height + 2);

                const finalUri = canvas.toDataURL('image/png');

                // Restore transformer
                if (transformerConfig) {
                    trRef.current?.nodes(transformerConfig);
                }

                const link = document.createElement('a');
                link.download = `feng-shui-export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                link.href = finalUri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            // Fallback: if the image fails to load, restore transformer and save original capture
            img.onerror = () => {
                if (transformerConfig) {
                    trRef.current?.nodes(transformerConfig);
                }

                const link = document.createElement('a');
                link.download = `feng-shui-export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                link.href = dataUri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
    }, [exportTrigger]);

    useEffect(() => {
        if (compass.mode === 'interactive' && trRef.current && compassRef.current) {
            trRef.current.nodes([compassRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [compass.mode, compass.visible]);

    const handleCompassTransformStart = () => {
        if (compassRef.current) {
            lastCompassRotation.current = compassRef.current.rotation();
            // Keep the original center & radius so we can restore center after a scale
            lastCompassCenter.current = { x: compassRef.current.x(), y: compassRef.current.y() };
            lastCompassRadius.current = compass.radius;
        }
    };

    const handleCompassTransform = () => {
        const node = compassRef.current;
        if (!node) return;

        if (compass.locked) {
            const currentRot = node.rotation();
            const delta = currentRot - lastCompassRotation.current;
            lastCompassRotation.current = currentRot;

            if (floorplanRef.current) {
                // Rotate floorplan around compass center
                const cx = node.x();
                const cy = node.y();
                const fx = floorplanRef.current.x();
                const fy = floorplanRef.current.y();

                const rad = (delta * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);

                const dx = fx - cx;
                const dy = fy - cy;

                const newX = cx + (dx * cos - dy * sin);
                const newY = cy + (dx * sin + dy * cos);

                floorplanRef.current.x(newX);
                floorplanRef.current.y(newY);
                floorplanRef.current.rotation(floorplanRef.current.rotation() + delta);
            }

            // Counter-rotate visual
            const visual = node.findOne('.compass-inner-visual');
            if (visual) {
                visual.rotation(-currentRot);
            }
        }
    };

    const handleCompassTransformEnd = () => {
        const node = compassRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        node.scaleX(1);
        node.scaleY(1);

        // Keep the center fixed when resizing: restore stored center
        node.x(lastCompassCenter.current.x);
        node.y(lastCompassCenter.current.y);

        const newRadius = Math.max(50, lastCompassRadius.current * scaleX);

        if (compass.locked) {
            if (floorplanRef.current) {
                updateFloorplan({
                    rotation: floorplanRef.current.rotation(),
                    x: floorplanRef.current.x(),
                    y: floorplanRef.current.y()
                });
            }

            node.rotation(0);
            const visual = node.findOne('.compass-inner-visual');
            if (visual) visual.rotation(0);

            updateCompass({
                x: lastCompassCenter.current.x,
                y: lastCompassCenter.current.y,
                rotation: 0,
                radius: newRadius
            });
        } else {
            updateCompass({
                x: lastCompassCenter.current.x,
                y: lastCompassCenter.current.y,
                rotation: node.rotation(),
                radius: newRadius
            });
        }
    };

    // Canvas dimensions - responsive to parent container
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<CanvasItem | null>(null);
    const [isAltPressed, setIsAltPressed] = useState(false);
    const [isPolylineMode, setIsPolylineMode] = useState(false);

    // Text editing state
    const [editingText, setEditingText] = useState<{
        id?: string;
        x: number;
        y: number;
        stageX: number;
        stageY: number;
        width: number;
        height: number;
        text: string;
        rotation: number;
        fontSize: number;
        fontFamily: string;
        fill: string;
        stroke: string;
    } | null>(null);

    // Load floorplan image
    useEffect(() => {
        if (floorplan.imageSrc) {
            const img = new window.Image();
            img.src = floorplan.imageSrc;
            img.onload = () => {
                setFloorplanImg(img);
                // Initial placement: Center the floorplan
                if (containerRef.current) {
                    const stageW = containerRef.current.offsetWidth;
                    const stageH = containerRef.current.offsetHeight;
                    // Reset scale to 1 for new project/image load
                    // Center the image in the view
                    const x = (stageW - img.width) / 2;
                    const y = (stageH - img.height) / 2;
                    setStagePos({ x, y, scale: 1 });
                }
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

        // Start drawing for all shape tools INCLUDING text
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

            case 'text':
                newShape = {
                    id,
                    type: 'text',
                    x: localPos.x,
                    y: localPos.y,
                    width: 0,
                    height: 0,
                    text: '',
                    fontSize: toolSettings.fontSize,
                    fontFamily: toolSettings.fontFamily,
                    fontStyle: toolSettings.fontStyle,
                    fontWeight: toolSettings.fontWeight,
                    align: toolSettings.textAlign,
                    rotation: 0,
                    fill: colors.fill,
                    stroke: colors.stroke,
                    strokeWidth: toolSettings.lineWidth,
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
            case 'rectangle':
            case 'text': {
                const rectShape = currentShape as Extract<CanvasItem, { type: 'rectangle' | 'text' }>;
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

    const handleTextComplete = () => {
        if (editingText) {
            if (editingText.text.trim()) {
                if (editingText.id) {
                    // Update existing text
                    updateItem(editingText.id, {
                        text: editingText.text
                    });
                } else {
                    // Add new text
                    const id = Math.random().toString(36).substr(2, 9);
                    const newText: CanvasItem = {
                        id,
                        type: 'text',
                        x: editingText.stageX,
                        y: editingText.stageY,
                        width: editingText.width,
                        height: editingText.height,
                        text: editingText.text,
                        fontSize: editingText.fontSize,
                        fontFamily: editingText.fontFamily,
                        fontStyle: toolSettings.fontStyle,
                        fontWeight: toolSettings.fontWeight,
                        align: toolSettings.textAlign,
                        rotation: editingText.rotation,
                        fill: editingText.fill,
                        stroke: editingText.stroke,
                        strokeWidth: toolSettings.lineWidth,
                        opacity: 1,
                        draggable: true
                    };
                    addItem(newText);
                }
            } else if (editingText.id) {
                // Empty string on existing text -> maybe delete? or just keep empty?
                // Let's keep empty or user can delete manually.
                updateItem(editingText.id, { text: '' });
            }
            setEditingText(null);
        }
    };

    const handleShapeDblClick = (item: CanvasItem) => {
        if (item.type === 'text') {
            const stage = stageRef.current;
            const textItem = item as any; // Cast for TS

            // Calculate screen position
            const tr = stage.getAbsoluteTransform();
            const absPos = tr.point({ x: item.x, y: item.y });

            setEditingText({
                id: item.id,
                x: absPos.x,
                y: absPos.y,
                stageX: item.x,
                stageY: item.y,
                width: textItem.width,
                height: textItem.height,
                text: textItem.text,
                rotation: item.rotation,
                fontSize: textItem.fontSize,
                fontFamily: textItem.fontFamily,
                fill: textItem.fill,
                stroke: textItem.stroke
            });
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
                case 'text': {
                    const textShape = currentShape as any;
                    if (Math.abs(textShape.width) > 10 && Math.abs(textShape.height) > 10) {
                        const stage = stageRef.current;
                        // We need the absolute position for the HTML element overlay
                        // currentShape x,y is in Stage coordinates (local)
                        // We need to project that to screen coordinates
                        const pos = { x: textShape.x, y: textShape.y };
                        const tr = stage.getAbsoluteTransform();
                        const absPos = tr.point(pos);

                        setEditingText({
                            x: absPos.x,
                            y: absPos.y,
                            stageX: textShape.x,
                            stageY: textShape.y,
                            // Keep width/height in stage coordinates and apply scaling when rendering the overlay
                            width: textShape.width,
                            height: textShape.height,
                            text: '',
                            // Provide defaults so the editing state matches the expected shape
                            rotation: textShape.rotation ?? 0,
                            fontSize: textShape.fontSize ?? toolSettings.fontSize,
                            fontFamily: textShape.fontFamily ?? toolSettings.fontFamily,
                            fill: textShape.fill ?? colors.fill,
                            stroke: textShape.stroke ?? colors.stroke
                        });
                    }
                    shouldAdd = false;
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
                            ref={floorplanRef}
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

                    {/* Compass */}
                    {compass.mode !== 'hidden' && (
                        <>
                            <CompassShape
                                ref={compassRef}
                                x={compass.x}
                                y={compass.y}
                                radius={compass.radius}
                                rotation={compass.rotation}
                                opacity={compass.opacity}
                                mode={compass.mode}
                                onChange={(attrs) => updateCompass(attrs)}
                            />
                            {compass.mode === 'interactive' && (
                                <Transformer
                                    ref={trRef}
                                    onTransformStart={handleCompassTransformStart}
                                    onTransform={handleCompassTransform}
                                    onTransformEnd={handleCompassTransformEnd}
                                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                />
                            )}
                        </>
                    )}

                    {/* Objects Layer */}
                    {objects.map((item) => (
                        // Hide text item when editing to avoid duplication
                        (editingText && editingText.id === item.id) ? null : (
                            <ShapeRenderer
                                onDblClick={() => handleShapeDblClick(item)}
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.includes(item.id)}
                                onSelect={() => selectItem(item.id)}
                                onChange={(updates) => updateItem(item.id, updates)}
                            />
                        )
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

            {editingText && (
                <textarea
                    value={editingText.text}
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={handleTextComplete}
                    autoFocus
                    placeholder="Type..."
                    style={{
                        position: 'absolute',
                        left: editingText.x,
                        top: editingText.y,
                        width: `${Math.abs(editingText.width * stagePos.scale)}px`,
                        height: `${Math.abs(editingText.height * stagePos.scale)}px`,
                        fontSize: `${editingText.fontSize * stagePos.scale}px`,
                        fontFamily: editingText.fontFamily,
                        fontWeight: toolSettings.fontWeight,
                        fontStyle: toolSettings.fontStyle,
                        lineHeight: 1.2,
                        color: editingText.stroke,
                        backgroundColor: editingText.fill === 'transparent' ? 'transparent' : editingText.fill,
                        border: 'none',
                        outline: '2px solid blue',
                        padding: '5px',
                        zIndex: 1000,
                        resize: 'none',
                        overflow: 'hidden',
                        transform: `rotate(${editingText.rotation}deg)`,
                        transformOrigin: 'top left',
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                />
            )}

        </div>
    );
};
