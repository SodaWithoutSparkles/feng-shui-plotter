import { useState, useCallback, type RefObject } from 'react';
import type { CanvasItem } from '../../../types';
import { createShape, updateShapeWhileDrawing, shouldAddShape } from '../utils/shapeHelpers';

export const useDrawingTools = (
    activeTool: string,
    colors: { stroke: string; fill: string; active: string },
    toolSettings: any,
    isDropperActive: boolean,
    setColors: (colors: any) => void,
    setDropperActive: (active: boolean) => void,
    addItem: (item: CanvasItem) => void,
    stageRef: RefObject<any>,
    isAltPressed: boolean,
    isPolylineMode: boolean,
    setIsPolylineMode: (mode: boolean) => void
) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<CanvasItem | null>(null);

    const handleMouseDown = useCallback((e: any) => {
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

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const transform = stage.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(pos);

        setIsDrawing(true);

        const newShape = createShape(activeTool, localPos, colors, toolSettings);

        if (newShape) {
            setCurrentShape(newShape);
        }
    }, [activeTool, colors, toolSettings, isDropperActive, setColors, setDropperActive, stageRef]);

    const handleMouseMove = useCallback(() => {
        if (!isDrawing || !currentShape) return;

        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const transform = stage.getAbsoluteTransform().copy().invert();
        const localPos = transform.point(pos);

        const updatedShape = updateShapeWhileDrawing(
            currentShape,
            localPos,
            isAltPressed,
            isPolylineMode
        );

        setCurrentShape(updatedShape);

        if (isPolylineMode) {
            setIsPolylineMode(false);
        }
    }, [isDrawing, currentShape, stageRef, isAltPressed, isPolylineMode, setIsPolylineMode]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing && currentShape) {
            if (shouldAddShape(currentShape)) {
                addItem(currentShape);
            }
        }

        setIsDrawing(false);
        setCurrentShape(null);
    }, [isDrawing, currentShape, addItem]);

    return {
        isDrawing,
        currentShape,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
};
