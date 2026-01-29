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
                    const x = (stageW - img.width) / 2;
                    const y = (stageH - img.height) / 2;
                    setStagePos({ x, y, scale: 1 });
                }
            };
        } else {
            setFloorplanImg(null);
        }
    }, [imageSrc, containerRef, setStagePos]);

    return floorplanImg;
};
