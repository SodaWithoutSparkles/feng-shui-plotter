import React, { useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useStore } from '../../store/useStore';
import { CompassShape } from './CompassShape';
import { ShapeRenderer } from './ShapeRenderer';
import { TextEditorOverlay } from './TextEditorOverlay';
import { useCanvasExport } from './hooks/useCanvasExport';
import { useCanvasNavigation } from './hooks/useCanvasNavigation';
import { useCanvasDimensions } from './hooks/useCanvasDimensions';
import { useDrawingTools } from './hooks/useDrawingTools';
import { useTextEditor } from './hooks/useTextEditor';
import { useFloorplanImage } from './hooks/useFloorplanImage';
import { useCompassTransform } from './hooks/useCompassTransform';

export const FloorplanCanvas: React.FC = () => {
    // Store state
    const floorplan = useStore((state) => state.floorplan);
    const objects = useStore((state) => state.objects);
    const compass = useStore((state) => state.compass);
    const updateCompass = useStore((state) => state.updateCompass);
    const updateFloorplan = useStore((state) => state.updateFloorplan);
    const selectedIds = useStore((state) => state.selectedIds);
    const selectItem = useStore((state) => state.selectItem);
    const toggleSelectItem = useStore((state) => state.toggleSelectItem);
    const updateItem = useStore((state) => state.updateItem);
    const moveItemsByDeltaTransient = useStore((state) => state.moveItemsByDeltaTransient);
    const commitHistory = useStore((state) => state.commitHistory);
    const addItem = useStore((state) => state.addItem);
    const activeTool = useStore((state) => state.activeTool);
    const colors = useStore((state) => state.colors);
    const setColors = useStore((state) => state.setColors);
    const isDropperActive = useStore((state) => state.isDropperActive);
    const setDropperActive = useStore((state) => state.setDropperActive);
    const toolSettings = useStore((state) => state.toolSettings);
    const exportTrigger = useStore((state) => state.exportTrigger);
    const keyboardShortcuts = useStore((state) => state.keyboardShortcuts);

    // Refs
    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const floorplanRef = useRef<any>(null);
    const compassRef = useRef<any>(null);
    const trRef = useRef<any>(null);
    const groupDragSnapshotRef = useRef<typeof objects | null>(null);

    // Custom hooks
    const dimensions = useCanvasDimensions(containerRef);
    const { stagePos, setStagePos, handleWheel } = useCanvasNavigation(stageRef);
    const {
        editingText,
        setEditingText,
        handleShapeDblClick,
        handleTextComplete,
        handleTextCancel,
        startTextEditing
    } = useTextEditor(
        stageRef,
        stagePos.scale,
        toolSettings,
        updateItem,
        addItem
    );

    const {
        currentShapes,
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
        (shape) => {
            startTextEditing(
                shape.x,
                shape.y,
                shape.width,
                shape.height,
                shape.text,
                shape.fontSize,
                shape.fontFamily,
                shape.fill,
                shape.stroke,
                shape.rotation,
                shape.textColor ?? shape.stroke,
                shape.id
            );
        },
        keyboardShortcuts.modifyKey,
        keyboardShortcuts.cancelKey
    );

    const floorplanImg = useFloorplanImage(floorplan.imageSrc, containerRef, setStagePos);

    useCanvasExport(exportTrigger, stageRef, trRef);

    const {
        handleCompassTransformStart,
        handleCompassTransform,
        handleCompassTransformEnd
    } = useCompassTransform(
        compass,
        compassRef,
        floorplanRef,
        trRef,
        updateCompass,
        updateFloorplan
    );

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
                            ref={compassRef}
                            x={compass.x}
                            y={compass.y}
                            radius={compass.radius}
                            rotation={compass.rotation}
                            opacity={compass.opacity}
                            mode={compass.mode}
                            onChange={(attrs) => updateCompass(attrs)}
                            onTransformStart={handleCompassTransformStart}
                            onTransform={handleCompassTransform}
                            onTransformEnd={handleCompassTransformEnd}
                        />
                    )}

                    {compass.mode === 'interactive' && (
                        <Transformer
                            ref={trRef}
                            rotateEnabled
                            keepRatio
                            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
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
                                onSelect={(e) => {
                                    const isCtrl = !!e?.evt?.ctrlKey;
                                    if (isCtrl) {
                                        toggleSelectItem(item.id);
                                        return;
                                    }
                                    selectItem(item.id);
                                }}
                                onChange={(updates) => updateItem(item.id, updates)}
                                onGroupDragStart={
                                    activeTool === 'select' && selectedIds.length > 1 && selectedIds.includes(item.id)
                                        ? () => {
                                            if (!groupDragSnapshotRef.current) {
                                                groupDragSnapshotRef.current = objects;
                                            }
                                        }
                                        : undefined
                                }
                                onGroupDragMove={
                                    activeTool === 'select' && selectedIds.length > 1 && selectedIds.includes(item.id)
                                        ? (delta) => moveItemsByDeltaTransient(selectedIds, delta)
                                        : undefined
                                }
                                onGroupDragEnd={
                                    activeTool === 'select' && selectedIds.length > 1 && selectedIds.includes(item.id)
                                        ? () => {
                                            if (groupDragSnapshotRef.current) {
                                                commitHistory(groupDragSnapshotRef.current);
                                                groupDragSnapshotRef.current = null;
                                            }
                                        }
                                        : undefined
                                }
                            />
                        )
                    )}

                    {/* Current Shape Being Drawn */}
                    {currentShapes.map((shape) => (
                        <ShapeRenderer
                            key={shape.id}
                            item={shape}
                            isSelected={false}
                            onSelect={() => { }}
                            onChange={() => { }}
                        />
                    ))}
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
                    onCancel={handleTextCancel}
                    cancelKey={keyboardShortcuts.cancelKey}
                    saveKey={keyboardShortcuts.textSave.key}
                    saveModifier={keyboardShortcuts.textSave.modifier}
                />
            )}
        </div>
    );
};
