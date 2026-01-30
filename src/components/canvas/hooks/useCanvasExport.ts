import { useEffect, useRef, type RefObject } from 'react';
import { genFullFlyStarSeq } from '../../../utils/FengShui';
import type { FengShuiData, SaveFile } from '../../../types';

interface ExportOptions {
    filename: string;
    fengShui: FengShuiData;
    compass: SaveFile['compass'];
    updateCompass: (updates: Partial<SaveFile['compass']>) => void;
}

export const useCanvasExport = (
    exportTrigger: number,
    stageRef: RefObject<any>,
    trRef: RefObject<any>,
    options: ExportOptions
) => {
    const optionsRef = useRef<ExportOptions>(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const buildFlystarData = () => {
        const currentYear = new Date().getFullYear();
        const offset = optionsRef.current.fengShui?.purples?.offset ?? 0;
        const displayYear = currentYear + offset;
        const flyStarData = genFullFlyStarSeq(optionsRef.current.fengShui, displayYear);
        return {
            blacks: flyStarData.blacks.map((v) => Number(v)),
            reds: flyStarData.reds.map((v) => Number(v)),
            blues: flyStarData.blues.map((v) => Number(v)),
            purples: flyStarData.purples.map((v) => Number(v))
        };
    };

    const captureStageData = async (compassMode?: SaveFile['compass']['mode']) => {
        if (!stageRef.current) return null;

        const pixelRatio = 2;
        const originalMode = optionsRef.current.compass.mode;
        const shouldOverrideMode = compassMode && compassMode !== originalMode;

        if (shouldOverrideMode) {
            optionsRef.current.updateCompass({ mode: compassMode });
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }

        const transformerConfig = trRef.current?.nodes();
        trRef.current?.nodes([]);

        const dataUrl = stageRef.current.toDataURL({ pixelRatio });
        const width = stageRef.current.width() * pixelRatio;
        const height = stageRef.current.height() * pixelRatio;

        if (transformerConfig) {
            trRef.current?.nodes(transformerConfig);
        }

        if (shouldOverrideMode) {
            optionsRef.current.updateCompass({ mode: originalMode });
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }

        return {
            dataUrl,
            width,
            height,
            compassMode: compassMode ?? originalMode
        };
    };

    useEffect(() => {
        if (exportTrigger <= 0 || !stageRef.current) return;

        const existingModal = document.getElementById('export-preview-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const styleId = 'export-preview-style';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            styleTag.textContent = `
                * { box-sizing: border-box; }
                .export-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); display: flex; align-items: center; justify-content: center; z-index: 9999; }
                .export-window { width: min(1200px, 94vw); height: min(800px, 94vh); background: #0f172a; color: #e2e8f0; border-radius: 16px; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.45); display: flex; flex-direction: column; overflow: hidden; border: 1px solid #1f2937; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
                .export-header { padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; background: #111827; border-bottom: 1px solid #1f2937; }
                .export-header h1 { margin: 0; font-size: 16px; font-weight: 700; }
                .export-close { border: none; background: transparent; color: #94a3b8; font-size: 14px; cursor: pointer; padding: 4px 8px; }
                .export-close:hover { color: #e2e8f0; }
                .layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: 100%; }
                .preview { padding: 24px; overflow: auto; }
                .panel { padding: 24px; background: #111827; border-left: 1px solid #1f2937; display: flex; flex-direction: column; gap: 16px; }
                .card { background: #0b1220; border: 1px solid #1f2937; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
                label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
                .row { display: flex; gap: 8px; align-items: center; }
                input, select { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; }
                input[type=range] { width: 100%; }
                .value { font-size: 12px; color: #cbd5f5; }
                .button { padding: 10px 14px; border-radius: 10px; border: none; background: #38bdf8; color: #0f172a; font-weight: 700; cursor: pointer; }
                .button:disabled { opacity: 0.5; cursor: not-allowed; }
                canvas { width: 100%; height: auto; background: #0f172a; border-radius: 12px; border: 1px solid #1f2937; }
                .preview-meta { margin-top: 10px; font-size: 12px; color: #94a3b8; }
                @media (max-width: 1024px) {
                    .layout { grid-template-columns: 1fr; }
                    .panel { border-left: none; border-top: 1px solid #1f2937; }
                }
            `;
            document.head.appendChild(styleTag);
        }

        const modal = document.createElement('div');
        modal.id = 'export-preview-modal';
        modal.innerHTML = `
            <div class="export-overlay" data-export-overlay>
                <div class="export-window" role="dialog" aria-modal="true">
                    <div class="export-header">
                        <h1>Export Preview</h1>
                        <button class="export-close" type="button" data-export-close>Close</button>
                    </div>
                    <div class="layout">
                        <div class="preview">
                            <canvas id="previewCanvas"></canvas>
                            <div class="preview-meta" id="previewMeta">Capturing preview...</div>
                        </div>
                        <div class="panel">
                            <div class="card">
                                <label for="filename">Filename</label>
                                <div class="row">
                                    <input id="filename" type="text" placeholder="feng-shui-export" />
                                    <select id="ext">
                                        <option value="png">.png</option>
                                        <option value="jpg">.jpg</option>
                                        <option value="webp">.webp</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card">
                                <label>Size</label>
                                <input id="scale" type="range" min="0.5" max="3" step="0.1" value="1" />
                                <div class="row" style="justify-content: space-between;">
                                    <span class="value" id="scaleValue">100%</span>
                                    <span class="value" id="sizeValue">0 × 0 px</span>
                                </div>
                            </div>
                            <div class="card">
                                <label>Quality</label>
                                <input id="quality" type="range" min="0.5" max="1" step="0.02" value="0.92" />
                                <div class="row" style="justify-content: space-between;">
                                    <span class="value" id="qualityValue">92%</span>
                                    <span class="value" id="qualityHint">JPG/WebP only</span>
                                </div>
                            </div>
                            <div class="card">
                                <label>Compass</label>
                                <select id="compassMode">
                                    <option value="hidden">Hide</option>
                                    <option value="visible">View</option>
                                    <option value="projections">Projection</option>
                                </select>
                            </div>
                            <div class="card">
                                <label>Flystar chart</label>
                                <select id="flystarPlacement">
                                    <option value="top-left">Top left</option>
                                    <option value="top-right">Top right</option>
                                    <option value="bottom-left">Bottom left</option>
                                    <option value="bottom-right">Bottom right</option>
                                    <option value="extend-top-left">Extend + top left</option>
                                    <option value="extend-top-right">Extend + top right</option>
                                    <option value="extend-bottom-left">Extend + bottom left</option>
                                    <option value="extend-bottom-right">Extend + bottom right</option>
                                </select>
                            </div>
                            <button class="button" id="downloadBtn" disabled>Download</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const overlay = modal.querySelector('[data-export-overlay]') as HTMLDivElement | null;
        const closeButton = modal.querySelector('[data-export-close]') as HTMLButtonElement | null;
        const previewCanvas = modal.querySelector('#previewCanvas') as HTMLCanvasElement | null;
        const previewMeta = modal.querySelector('#previewMeta') as HTMLDivElement | null;
        const filenameInput = modal.querySelector('#filename') as HTMLInputElement | null;
        const extSelect = modal.querySelector('#ext') as HTMLSelectElement | null;
        const scaleInput = modal.querySelector('#scale') as HTMLInputElement | null;
        const scaleValue = modal.querySelector('#scaleValue') as HTMLSpanElement | null;
        const sizeValue = modal.querySelector('#sizeValue') as HTMLSpanElement | null;
        const qualityInput = modal.querySelector('#quality') as HTMLInputElement | null;
        const qualityValue = modal.querySelector('#qualityValue') as HTMLSpanElement | null;
        const qualityHint = modal.querySelector('#qualityHint') as HTMLSpanElement | null;
        const compassSelect = modal.querySelector('#compassMode') as HTMLSelectElement | null;
        const flystarSelect = modal.querySelector('#flystarPlacement') as HTMLSelectElement | null;
        const downloadBtn = modal.querySelector('#downloadBtn') as HTMLButtonElement | null;

        if (!previewCanvas || !previewMeta || !filenameInput || !extSelect || !scaleInput || !scaleValue || !sizeValue || !qualityInput || !qualityValue || !qualityHint || !compassSelect || !flystarSelect || !downloadBtn) {
            modal.remove();
            return;
        }

        const digitToChinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

        const state = {
            stageDataUrl: null as string | null,
            stageWidth: 0,
            stageHeight: 0,
            scale: 1,
            quality: 0.92,
            ext: 'png',
            compassMode: (optionsRef.current.compass?.mode ?? 'visible') as SaveFile['compass']['mode'],
            flystarPlacement: 'bottom-right',
            flystar: null as ReturnType<typeof buildFlystarData> | null
        };

        const stageImage = new Image();
        stageImage.onload = () => {
            drawPreview();
        };

        const updateQualityState = () => {
            const isLossy = state.ext !== 'png';
            qualityInput.disabled = !isLossy;
            qualityHint.textContent = isLossy ? 'JPG/WebP only' : 'PNG ignores quality';
        };

        const updateScaleLabel = () => {
            scaleValue.textContent = Math.round(state.scale * 100) + '%';
        };

        const updateQualityLabel = () => {
            qualityValue.textContent = Math.round(state.quality * 100) + '%';
        };

        const drawFlystar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, data: ReturnType<typeof buildFlystarData>) => {
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
                    ctx.fillRect(cellX + cell * 0.5, cellY + cell * 0.5, cell * 0.5, cell * 0.5);
                    ctx.font = fontLarge + 'px sans-serif';
                    ctx.fillStyle = '#7c3aed';
                    ctx.fillText(String(data.purples[i]), cellX + cell * 0.75, cellY + cell * 0.75);
                }
            }

            ctx.restore();
        };

        const parsePlacement = (placement: string) => {
            const isExtended = placement.startsWith('extend-');
            const basePlacement = isExtended ? placement.replace('extend-', '') : placement;
            return { isExtended, basePlacement };
        };

        const drawPreview = () => {
            if (!state.stageDataUrl || !state.flystar || !stageImage.complete) return;

            const baseWidth = Math.round(state.stageWidth * state.scale);
            const baseHeight = Math.round(state.stageHeight * state.scale);
            const chartSize = Math.max(140, Math.round(Math.min(baseWidth, baseHeight) * 0.25));
            const margin = Math.round(chartSize * 0.08);

            let outputWidth = baseWidth;
            let outputHeight = baseHeight;
            let offsetX = 0;
            let offsetY = 0;

            const { isExtended, basePlacement } = parsePlacement(state.flystarPlacement);
            if (isExtended) {
                const padding = chartSize + margin * 2;
                let padTop = 0;
                let padRight = 0;
                let padBottom = 0;
                let padLeft = 0;

                if (basePlacement.includes('top')) {
                    padTop = padding;
                }
                if (basePlacement.includes('bottom')) {
                    padBottom = padding;
                }
                if (basePlacement.includes('left')) {
                    padLeft = padding;
                }
                if (basePlacement.includes('right')) {
                    padRight = padding;
                }

                outputWidth = baseWidth + padLeft + padRight;
                outputHeight = baseHeight + padTop + padBottom;
                offsetX = padLeft;
                offsetY = padTop;
            }

            previewCanvas.width = outputWidth;
            previewCanvas.height = outputHeight;
            const ctx = previewCanvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outputWidth, outputHeight);
            ctx.drawImage(stageImage, offsetX, offsetY, baseWidth, baseHeight);

            let x = margin;
            let y = margin;
            if (basePlacement === 'top-right') {
                x = outputWidth - chartSize - margin;
            }
            if (basePlacement === 'bottom-left') {
                y = outputHeight - chartSize - margin;
            }
            if (basePlacement === 'bottom-right') {
                x = outputWidth - chartSize - margin;
                y = outputHeight - chartSize - margin;
            }

            drawFlystar(ctx, x, y, chartSize, state.flystar);

            sizeValue.textContent = outputWidth + ' × ' + outputHeight + ' px';
            previewMeta.textContent = 'Preview ready • ' + outputWidth + ' × ' + outputHeight + 'px';
            downloadBtn.disabled = false;
        };

        const updateStageCapture = async (compassMode?: SaveFile['compass']['mode']) => {
            downloadBtn.disabled = true;
            previewMeta.textContent = 'Capturing preview...';
            const capture = await captureStageData(compassMode);
            if (!capture) return;

            state.stageDataUrl = capture.dataUrl;
            state.stageWidth = capture.width;
            state.stageHeight = capture.height;
            state.compassMode = capture.compassMode;
            state.flystar = buildFlystarData();

            if (filenameInput.value.trim().length === 0) {
                filenameInput.value = optionsRef.current.filename || 'feng-shui-export';
            }

            stageImage.src = capture.dataUrl;
        };

        const closeModal = () => {
            window.removeEventListener('keydown', onKeyDown);
            modal.remove();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        overlay?.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        });

        closeButton?.addEventListener('click', () => closeModal());
        window.addEventListener('keydown', onKeyDown);

        filenameInput.value = optionsRef.current.filename || 'feng-shui-export';
        compassSelect.value = state.compassMode;
        flystarSelect.value = state.flystarPlacement;

        filenameInput.addEventListener('input', () => {
            if (!filenameInput.value.trim()) {
                filenameInput.value = 'feng-shui-export';
            }
        });

        extSelect.addEventListener('change', () => {
            state.ext = extSelect.value;
            updateQualityState();
        });

        scaleInput.addEventListener('input', () => {
            state.scale = Number(scaleInput.value);
            updateScaleLabel();
            drawPreview();
        });

        qualityInput.addEventListener('input', () => {
            state.quality = Number(qualityInput.value);
            updateQualityLabel();
        });

        compassSelect.addEventListener('change', () => {
            state.compassMode = compassSelect.value as SaveFile['compass']['mode'];
            void updateStageCapture(state.compassMode);
        });

        flystarSelect.addEventListener('change', () => {
            state.flystarPlacement = flystarSelect.value;
            drawPreview();
        });

        downloadBtn.addEventListener('click', () => {
            const ext = state.ext;
            const mime = ext === 'png' ? 'image/png' : ext === 'jpg' ? 'image/jpeg' : 'image/webp';
            const quality = ext === 'png' ? undefined : state.quality;
            const dataUrl = previewCanvas.toDataURL(mime, quality);
            const link = document.createElement('a');
            const name = filenameInput.value.trim() || 'feng-shui-export';
            link.download = name + '.' + ext;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        updateScaleLabel();
        updateQualityLabel();
        updateQualityState();

        void updateStageCapture(state.compassMode);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            modal.remove();
        };
    }, [exportTrigger, stageRef, trRef]);
};
