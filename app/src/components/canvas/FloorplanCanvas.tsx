import React, { useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { useStore } from '../../store/useStore';
import { CompassShape } from './CompassShape';
import { ShapeRenderer } from './ShapeRenderer';
import { TextEditorOverlay } from './TextEditorOverlay';
import { useCanvasExport } from './hooks/useCanvasExport';
import { useCanvasNavigation } from './hooks/useCanvasNavigation';
import { useCanvasDimensions } from './hooks/useCanvasDimensions';
import { useKeyboardModifiers } from './hooks/useKeyboardModifiers';
import { useDrawingTools } from './hooks/useDrawingTools';
import { useTextEditor } from './hooks/useTextEditor';
import { useFloorplanImage } from './hooks/useFloorplanImage';

export const FloorplanCanvas: React.FC = () => {
    // Store state
    const floorplan = useStore((state) => state.floorplan);
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

    // Refs
    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const floorplanRef = useRef<any>(null);
    const trRef = useRef<any>(null);

    // Custom hooks
    const dimensions = useCanvasDimensions(containerRef);
    const { stagePos, setStagePos, handleWheel } = useCanvasNavigation(stageRef);
    const { isAltPressed, isPolylineMode, setIsPolylineMode } = useKeyboardModifiers(activeTool, false);

    const {
        currentShape,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    } = useDrawingTools(
        activeTool,
        colors,
        toolSettings,
        isDropperActive,
        setColors,
        setDropperActive,
        addItem,
        stageRef,
        isAltPressed,
        isPolylineMode,
        setIsPolylineMode
    );

    const {
        editingText,
        setEditingText,
        handleShapeDblClick,
        handleTextComplete
    } = useTextEditor(
        stageRef,
        stagePos.scale,
        toolSettings,
        updateItem,
        addItem
    );

    const floorplanImg = useFloorplanImage(floorplan.imageSrc, containerRef, setStagePos);

    useCanvasExport(exportTrigger, stageRef, trRef);

    const handleStageClick = (e: any) => {
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
                    {/* Floorplan Image */}
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
                        <CompassShape
                            x={compass.x}
                            y={compass.y}
                            radius={compass.radius}
                            rotation={compass.rotation}
                            opacity={compass.opacity}
                            mode={compass.mode}
                            onChange={(attrs) => updateCompass(attrs)}
                        />
                    )}

                    {/* Canvas Objects */}
                    {objects.map((item) =>
                        editingText && editingText.id === item.id ? null : (
                            <ShapeRenderer
                                onDblClick={() => handleShapeDblClick(item)}
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.includes(item.id)}
                                onSelect={() => selectItem(item.id)}
                                onChange={(updates) => updateItem(item.id, updates)}
                            />
                        )
                    )}

                    {/* Current Shape Being Drawn */}
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

            {/* Text Editor Overlay */}
            {editingText && (
                <TextEditorOverlay
                    editingText={editingText}
                    stageScale={stagePos.scale}
                    fontStyle={toolSettings.fontStyle}
                    fontWeight={toolSettings.fontWeight}
                    onTextChange={(text) => setEditingText({ ...editingText, text })}
                    onComplete={handleTextComplete}
                />
            )}
        </div>
    );
};
