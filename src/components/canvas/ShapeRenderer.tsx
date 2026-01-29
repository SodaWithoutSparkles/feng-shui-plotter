import React from 'react';
import { Rect, Circle, Line, Star, Arrow, Text as KonvaText, Image as KonvaImage, Transformer, Group } from 'react-konva';
import type { CanvasItem } from '../../types';

interface ShapeRendererProps {
    item: CanvasItem;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (updates: Partial<CanvasItem>) => void;
    onDblClick?: () => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
    item,
    isSelected,
    onSelect,
    onChange,
    onDblClick
}) => {
    const shapeRef = React.useRef<any>(null);
    const trRef = React.useRef<any>(null);
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);

    // Load image if item type is 'image'
    React.useEffect(() => {
        if (item.type === 'image') {
            const img = new window.Image();
            img.src = item.src;
            img.onload = () => {
                setImage(img);
            };
        }
    }, [item.type, item.type === 'image' ? item.src : null]);

    React.useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const handleDragEnd = (e: any) => {
        onChange({
            x: e.target.x(),
            y: e.target.y()
        });
    };

    const handleTransformEnd = () => {
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        // Update item with new dimensions
        if (item.type === 'rectangle') {
            onChange({
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5, node.height() * scaleY),
                rotation: node.rotation()
            });
        } else if (item.type === 'ellipse') {
            onChange({
                x: node.x(),
                y: node.y(),
                radiusX: Math.max(5, item.radiusX * scaleX),
                radiusY: Math.max(5, item.radiusY * scaleY),
                rotation: node.rotation()
            });
        } else if (item.type === 'star') {
            onChange({
                x: node.x(),
                y: node.y(),
                innerRadius: Math.max(5, item.innerRadius * scaleX),
                outerRadius: Math.max(5, item.outerRadius * scaleX),
                rotation: node.rotation()
            });
        } else if (item.type === 'text') {
            // For text, only scale the bounding box, not the font size
            onChange({
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: Math.max(20, item.width * scaleX),
                height: Math.max(20, item.height * scaleY)
                // fontSize stays the same - don't scale it
            });
        } else {
            onChange({
                x: node.x(),
                y: node.y(),
                rotation: node.rotation()
            });
        }
    };

    const commonProps = {
        ref: shapeRef,
        draggable: item.draggable,
        x: item.x,
        y: item.y,
        rotation: item.rotation,
        stroke: item.stroke,
        strokeWidth: item.strokeWidth,
        fill: item.fill,
        opacity: item.opacity,
        onClick: onSelect,
        onTap: onSelect,
        onDragEnd: handleDragEnd,
        onTransformEnd: handleTransformEnd,
        onDblClick: onDblClick
    };

    let shape = null;

    switch (item.type) {
        case 'rectangle':
            shape = (
                <Rect
                    {...commonProps}
                    width={item.width}
                    height={item.height}
                />
            );
            break;

        case 'ellipse':
            shape = (
                <Circle
                    {...commonProps}
                    radius={Math.max(item.radiusX, item.radiusY)}
                    scaleX={item.radiusX / Math.max(item.radiusX, item.radiusY)}
                    scaleY={item.radiusY / Math.max(item.radiusX, item.radiusY)}
                />
            );
            break;

        case 'line':
            shape = (
                <Line
                    {...commonProps}
                    points={item.points.flatMap(p => [p.x, p.y])}
                    closed={item.closed}
                    tension={0.3}
                />
            );
            break;

        case 'star':
            shape = (
                <Star
                    {...commonProps}
                    numPoints={item.numPoints}
                    innerRadius={item.innerRadius}
                    outerRadius={item.outerRadius}
                />
            );
            break;

        case 'arrow':
            shape = (
                <Arrow
                    {...commonProps}
                    points={item.points.flatMap(p => [p.x, p.y])}
                    pointerLength={item.pointerLength}
                    pointerWidth={item.pointerWidth}
                />
            );
            break;

        case 'text':
            shape = (
                <Group
                    {...commonProps}
                >
                    {/* Background Box */}
                    <Rect
                        width={item.width}
                        height={item.height}
                        fill={item.fill}
                        stroke={item.stroke}
                        strokeWidth={item.strokeWidth}
                        shadowBlur={0}
                    />
                    {/* Text Content */}
                    <KonvaText
                        x={0}
                        y={0}
                        width={item.width}
                        height={item.height}
                        text={item.text}
                        fontSize={item.fontSize}
                        fontFamily={item.fontFamily}
                        fontStyle={item.fontStyle || 'normal'}
                        fontVariant={item.fontWeight || 'normal'}
                        align={item.align}
                        verticalAlign="top"
                        fill={item.stroke} // Use stroke color for text color
                        padding={5}
                    />
                </Group>
            );
            break;

        case 'image':
            if (image) {
                shape = (
                    <KonvaImage
                        {...commonProps}
                        image={image}
                        width={item.width}
                        height={item.height}
                    />
                );
            }
            break;

        default:
            return null;
    }

    return (
        <>
            {shape}
            {isSelected && <Transformer ref={trRef} />}
        </>
    );
};
