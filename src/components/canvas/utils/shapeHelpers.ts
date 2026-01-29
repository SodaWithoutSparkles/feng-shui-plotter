import type { CanvasItem } from '../../../types';

export const createShape = (
    activeTool: string,
    localPos: { x: number; y: number },
    colors: { stroke: string; fill: string },
    toolSettings: any
): CanvasItem | null => {
    const id = Math.random().toString(36).substr(2, 9);

    switch (activeTool) {
        case 'rectangle':
            return {
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

        case 'text':
            return {
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

        case 'ellipse':
            return {
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

        case 'line':
            return {
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

        case 'arrow':
            return {
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

        case 'star':
            return {
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

        default:
            return null;
    }
};

export const updateShapeWhileDrawing = (
    currentShape: CanvasItem,
    localPos: { x: number; y: number },
    isAltPressed: boolean,
    isPolylineMode: boolean
): CanvasItem => {
    switch (currentShape.type) {
        case 'rectangle':
        case 'text': {
            const rectShape = currentShape as Extract<CanvasItem, { type: 'rectangle' | 'text' }>;
            let width = localPos.x - currentShape.x;
            let height = localPos.y - currentShape.y;

            if (isAltPressed) {
                const size = Math.max(Math.abs(width), Math.abs(height));
                width = width >= 0 ? size : -size;
                height = height >= 0 ? size : -size;
            }

            return { ...rectShape, width, height };
        }

        case 'ellipse': {
            const ellipseShape = currentShape as Extract<CanvasItem, { type: 'ellipse' }>;
            let radiusX = Math.abs(localPos.x - currentShape.x);
            let radiusY = Math.abs(localPos.y - currentShape.y);

            if (isAltPressed) {
                const radius = Math.max(radiusX, radiusY);
                radiusX = radius;
                radiusY = radius;
            }

            return { ...ellipseShape, radiusX, radiusY };
        }

        case 'line': {
            const lineShape = currentShape as Extract<CanvasItem, { type: 'line' }>;
            let endX = localPos.x;
            let endY = localPos.y;

            if (isAltPressed && lineShape.points.length > 0) {
                const startPoint = lineShape.points[0];
                const dx = Math.abs(endX - startPoint.x);
                const dy = Math.abs(endY - startPoint.y);

                if (dx > dy) {
                    endY = startPoint.y;
                } else {
                    endX = startPoint.x;
                }
            }

            return {
                ...lineShape,
                points: [lineShape.points[0], { x: endX, y: endY }]
            };
        }

        case 'arrow': {
            const arrowShape = currentShape as Extract<CanvasItem, { type: 'arrow' }>;
            let endX = localPos.x;
            let endY = localPos.y;

            if (isAltPressed && arrowShape.points.length > 0) {
                const startPoint = arrowShape.points[0];
                const dx = Math.abs(endX - startPoint.x);
                const dy = Math.abs(endY - startPoint.y);

                if (dx > dy) {
                    endY = startPoint.y;
                } else {
                    endX = startPoint.x;
                }
            }

            if (isPolylineMode) {
                return {
                    ...arrowShape,
                    points: [...arrowShape.points, { x: endX, y: endY }]
                };
            } else {
                const newPoints = [...arrowShape.points];
                newPoints[newPoints.length - 1] = { x: endX, y: endY };
                return {
                    ...arrowShape,
                    points: newPoints
                };
            }
        }

        case 'star': {
            const starShape = currentShape as Extract<CanvasItem, { type: 'star' }>;
            const radius = Math.sqrt(
                Math.pow(localPos.x - currentShape.x, 2) + Math.pow(localPos.y - currentShape.y, 2)
            );
            return {
                ...starShape,
                innerRadius: radius * 0.5,
                outerRadius: radius
            };
        }

        default:
            return currentShape;
    }
};

export const shouldAddShape = (shape: CanvasItem): boolean => {
    switch (shape.type) {
        case 'rectangle': {
            const rectShape = shape as Extract<CanvasItem, { type: 'rectangle' }>;
            return Math.abs(rectShape.width) > 5 && Math.abs(rectShape.height) > 5;
        }
        case 'ellipse': {
            const ellipseShape = shape as Extract<CanvasItem, { type: 'ellipse' }>;
            return ellipseShape.radiusX > 5 && ellipseShape.radiusY > 5;
        }
        case 'star': {
            const starShape = shape as Extract<CanvasItem, { type: 'star' }>;
            return starShape.outerRadius > 5;
        }
        case 'line':
        case 'arrow': {
            const lineShape = shape as Extract<CanvasItem, { type: 'line' | 'arrow' }>;
            return lineShape.points.length >= 2;
        }
        case 'text':
            return false;
        default:
            return false;
    }
};
