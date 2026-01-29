import { useEffect, type RefObject } from 'react';

export const useCanvasExport = (
    exportTrigger: number,
    stageRef: RefObject<any>,
    trRef: RefObject<any>
) => {
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
    }, [exportTrigger, stageRef, trRef]);
};
