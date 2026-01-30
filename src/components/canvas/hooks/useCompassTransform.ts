import { useEffect, useRef, type RefObject } from 'react';

interface CompassState {
    mode: 'visible' | 'hidden' | 'interactive' | 'projections';
    visible: boolean;
    locked: boolean;
    x: number;
    y: number;
    rotation: number;
    radius: number;
}

interface FloorplanState {
    rotation: number;
    x: number;
    y: number;
}

export const useCompassTransform = (
    compass: CompassState,
    compassRef: RefObject<any>,
    floorplanRef: RefObject<any>,
    trRef: RefObject<any>,
    updateCompass: (updates: Partial<CompassState>) => void,
    updateFloorplan: (updates: Partial<FloorplanState>) => void
) => {
    const lastCompassRotation = useRef(0);
    const lastCompassCenter = useRef({ x: 0, y: 0 });
    const lastCompassRadius = useRef(0);

    useEffect(() => {
        if (compass.mode === 'interactive' && trRef.current && compassRef.current) {
            trRef.current.nodes([compassRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [compass.mode, compass.visible, trRef, compassRef]);

    const handleCompassTransformStart = () => {
        if (compassRef.current) {
            lastCompassRotation.current = compassRef.current.rotation();
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

            const visual = node.findOne('.compass-inner-visual');
            if (visual) {
                visual.rotation(-currentRot);
            }

            const projections = node.findOne('.compass-projections');
            if (projections) {
                projections.rotation(-currentRot);
            }
        }
    };

    const handleCompassTransformEnd = () => {
        const node = compassRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        node.scaleX(1);
        node.scaleY(1);
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
            const projections = node.findOne('.compass-projections');
            if (projections) projections.rotation(0);

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

    return {
        handleCompassTransformStart,
        handleCompassTransform,
        handleCompassTransformEnd
    };
};
