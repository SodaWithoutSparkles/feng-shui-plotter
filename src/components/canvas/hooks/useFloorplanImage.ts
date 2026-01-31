import { useState, useEffect, type RefObject } from 'react';

export const useFloorplanImage = (
    imageSrc: string | null,
    containerRef: RefObject<HTMLDivElement | null>,
    setStagePos: (pos: { x: number; y: number; scale: number }) => void
) => {
    const [floorplanImg, setFloorplanImg] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (imageSrc) {
            const img = new window.Image();
            img.src = imageSrc;
            img.onload = () => {
                setFloorplanImg(img);
                if (containerRef.current) {
                    const stageW = containerRef.current.offsetWidth;
                    const stageH = containerRef.current.offsetHeight;

                    // Calculate scale so the longer side of the floorplan is 50% of canvas
                    const targetSize = Math.max(stageW, stageH) * 0.5;
                    const imgLongSide = Math.max(img.width, img.height);
                    const scale = targetSize / imgLongSide;

                    // Center the stage view on the floorplan
                    // Since the image is rendered with center offset at (0,0),
                    // we align the stage center (0,0) to the canvas center
                    const x = stageW / 2;
                    const y = stageH / 2;

                    setStagePos({ x, y, scale });
                }
            };
        } else {
            setFloorplanImg(null);
        }
    }, [imageSrc, containerRef, setStagePos]);

    return floorplanImg;
};
