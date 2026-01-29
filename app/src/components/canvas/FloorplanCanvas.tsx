import React, { useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useStore } from '../../store/useStore';
import { CompassOverlay } from '../overlay/CompassOverlay';

export const FloorplanCanvas: React.FC = () => {
    // const floorplan = useStore((state) => state.floorplan);
    const items = useStore((state) => state.items);
    const compass = useStore((state) => state.compass);

    // Canvas dimensions - should be responsive to parent container
    const width = 1200;
    const height = 800;

    const stageRef = useRef<any>(null);

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

    return (
        <div className="w-full h-full relative object-contain bg-gray-200 overflow-hidden">
            <Stage
                width={width}
                height={height}
                onWheel={handleWheel}
                scaleX={stagePos.scale}
                scaleY={stagePos.scale}
                x={stagePos.x}
                y={stagePos.y}
                draggable
                ref={stageRef}
            >
                <Layer>
                    {/* Floorplan Layer */}
                    {/* Objects Layer */}
                    {items.map((item) => (
                        // Placeholder for debugging, avoiding unused var warning needs key usage
                        // <ShapeRenderer key={item.id} item={item} />
                        <React.Fragment key={item.id}></React.Fragment>
                    ))}
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
