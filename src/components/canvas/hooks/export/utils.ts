
const digitToChinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

export const drawFlystar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    data: { blacks: number[]; reds: number[]; blues: number[]; purples: number[] }
) => {
    const cell = size / 3;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const cellX = c * cell;
            const cellY = r * cell;
            ctx.strokeRect(cellX, cellY, cell, cell);

            const i = r * 3 + c;
            const fontSmall = Math.max(10, Math.floor(cell * 0.26));
            const fontLarge = Math.max(12, Math.floor(cell * 0.32));

            ctx.font = fontSmall + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#2563eb';
            ctx.fillText(String(data.blues[i]), cellX + cell * 0.25, cellY + cell * 0.3);

            ctx.fillStyle = '#dc2626';
            ctx.fillText(String(data.reds[i]), cellX + cell * 0.75, cellY + cell * 0.3);

            ctx.font = fontLarge + 'px serif';
            ctx.fillStyle = '#111827';
            ctx.fillText(digitToChinese[Number(data.blacks[i])] || '', cellX + cell * 0.25, cellY + cell * 0.75);

            ctx.fillStyle = '#fef3c7';
            // Specific fix for the purple background rect to be better aligned
            ctx.fillRect(cellX + cell * 0.5, cellY + cell * 0.5, cell * 0.5, cell * 0.5);

            ctx.font = fontLarge + 'px sans-serif';
            ctx.fillStyle = '#7c3aed';
            ctx.fillText(String(data.purples[i]), cellX + cell * 0.75, cellY + cell * 0.75);
        }
    }

    ctx.restore();
};

export const computeTrimBounds = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { x: 0, y: 0, width: image.width, height: image.height };
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const alpha = data[idx + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX < 0 || maxY < 0) {
        return { x: 0, y: 0, width: image.width, height: image.height };
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
};

export const computeTrimBoundsFromDataUrl = async (dataUrl: string) => {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load trim image'));
        img.src = dataUrl;
    });
    return computeTrimBounds(img);
};
