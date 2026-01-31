import { useEffect, useRef, type RefObject } from 'react';
import { genFullFlyStarSeq } from '../../../utils/FengShui';
import type { FengShuiData, SaveFile } from '../../../types';
import { getExportModalStyles } from './export/styles';
import { getExportModalTemplate } from './export/template';
import { drawFlystar, computeTrimBoundsFromDataUrl } from './export/utils';

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
            styleTag.textContent = getExportModalStyles();
            document.head.appendChild(styleTag);
        }

        const modal = document.createElement('div');
        modal.id = 'export-preview-modal';
        modal.innerHTML = getExportModalTemplate();

        document.body.appendChild(modal);

        const overlay = modal.querySelector('[data-export-overlay]') as HTMLDivElement | null;
        const closeButton = modal.querySelector('[data-export-close]') as HTMLButtonElement | null;
        const previewCanvas = modal.querySelector('#previewCanvas') as HTMLCanvasElement | null;
        const previewViewport = previewCanvas?.closest('.preview-viewport') as HTMLDivElement | null;
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
        const flystarTrigger = modal.querySelector('#flystarTrigger') as HTMLButtonElement | null;
        const flystarValue = modal.querySelector('#flystarValue') as HTMLElement | null;
        const flystarPopover = modal.querySelector('#flystarPopover') as HTMLDivElement | null;
        const flystarGrid = modal.querySelector('#flystarGrid') as HTMLDivElement | null;
        const downloadBtn = modal.querySelector('#downloadBtn') as HTMLButtonElement | null;
        const trimCheckbox = modal.querySelector('#trimEmpty') as HTMLInputElement | null;

        if (!previewCanvas || !previewViewport || !previewMeta || !filenameInput || !extSelect || !scaleInput || !scaleValue || !sizeValue || !qualityInput || !qualityValue || !qualityHint || !compassSelect || !flystarTrigger || !flystarValue || !flystarPopover || !flystarGrid || !downloadBtn || !trimCheckbox) {
            modal.remove();
            return;
        }

        const state = {
            stageDataUrl: null as string | null,
            stageWidth: 0,
            stageHeight: 0,
            scale: 1,
            quality: 0.92,
            ext: 'png',
            compassMode: (optionsRef.current.compass?.mode ?? 'visible') as SaveFile['compass']['mode'],
            flystarPlacement: 'r2c4',
            flystar: null as ReturnType<typeof buildFlystarData> | null,
            trimEmpty: true,
            trimBounds: null as { x: number; y: number; width: number; height: number } | null
        };

        const stageImage = new Image();
        stageImage.onload = () => {
            drawPreview();
        };

        const gridButtons: HTMLButtonElement[] = [];
        const placementKeyPattern = /^r([0-4])c([0-4])$/;
        let isFlystarPopoverOpen = false;

        const parsePlacementKey = (key: string) => {
            const match = placementKeyPattern.exec(key);
            if (!match) {
                return { row: 2, col: 4 };
            }
            return { row: Number(match[1]), col: Number(match[2]) };
        };

        const buildPlacementKey = (row: number, col: number) => `r${row}c${col}`;

        const placementLabel = (key: string) => {
            const { row, col } = parsePlacementKey(key);
            return `[${row}${col}]`;
        };

        const describePlacement = (row: number, col: number) => {
            if (row === 2 && col === 2) {
                return 'Center';
            }

            const extendParts: string[] = [];
            if (row === 0) extendParts.push('Extend top');
            if (row === 4) extendParts.push('Extend bottom');
            if (col === 0) extendParts.push('Extend left');
            if (col === 4) extendParts.push('Extend right');

            const alignParts: string[] = [];
            if (row === 1) alignParts.push('Align top');
            if (row === 2) alignParts.push('Align middle');
            if (row === 3) alignParts.push('Align bottom');
            if (col === 1) alignParts.push('Align left');
            if (col === 2) alignParts.push('Align center');
            if (col === 3) alignParts.push('Align right');

            const descriptionParts = [] as string[];
            if (extendParts.length) descriptionParts.push(extendParts.join(' & '));
            if (alignParts.length) descriptionParts.push(alignParts.join(' / '));
            if (!descriptionParts.length) {
                return 'Center';
            }
            return descriptionParts.join('; ');
        };

        const updateFlystarSelection = () => {
            const current = state.flystarPlacement;
            flystarValue.textContent = placementLabel(current);
            gridButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.key === current);
            });
        };

        const closeFlystarPopover = () => {
            if (!isFlystarPopoverOpen) return;
            isFlystarPopoverOpen = false;
            flystarPopover.classList.remove('open');
            document.removeEventListener('mousedown', handleOutsideClick);
        };

        const openFlystarPopover = () => {
            if (isFlystarPopoverOpen) return;
            isFlystarPopoverOpen = true;
            flystarPopover.classList.add('open');
            document.addEventListener('mousedown', handleOutsideClick);
        };

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (flystarPopover.contains(target) || flystarTrigger.contains(target)) {
                return;
            }
            closeFlystarPopover();
        };

        // Render the 5x5 placement grid and sync active state.
        const initializeFlystarGrid = () => {
            flystarGrid.innerHTML = '';
            gridButtons.length = 0;

            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'flystar-cell';
                    if (row === 0 || row === 4 || col === 0 || col === 4) {
                        button.classList.add('extend');
                    }
                    if (row === 2 && col === 2) {
                        button.classList.add('center');
                        button.textContent = 'X';
                    }
                    button.dataset.key = buildPlacementKey(row, col);
                    const description = describePlacement(row, col);
                    button.title = description;
                    button.setAttribute('aria-label', description);
                    button.addEventListener('click', () => {
                        state.flystarPlacement = button.dataset.key ?? 'r2c4';
                        updateFlystarSelection();
                        drawPreview();
                        closeFlystarPopover();
                    });
                    gridButtons.push(button);
                    flystarGrid.appendChild(button);
                }
            }

            updateFlystarSelection();
        };

        initializeFlystarGrid();

        flystarTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isFlystarPopoverOpen) {
                closeFlystarPopover();
            } else {
                openFlystarPopover();
            }
        });

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

        const updatePreviewScale = () => {
            const availableWidth = previewViewport.clientWidth;
            const availableHeight = previewViewport.clientHeight;
            const canvasWidth = previewCanvas.width;
            const canvasHeight = previewCanvas.height;
            if (!availableWidth || !availableHeight || !canvasWidth || !canvasHeight) return;
            const fitScale = Math.min(1, availableWidth / canvasWidth, availableHeight / canvasHeight);
            previewViewport.style.setProperty('--preview-scale', String(fitScale));
        };

        const drawPreview = () => {
            if (!state.stageDataUrl || !state.flystar || !stageImage.complete) return;

            const trimBorder = state.trimEmpty ? 10 : 0;
            if (state.trimEmpty && !state.trimBounds) {
                return;
            }

            const trimBounds = state.trimBounds ?? {
                x: 0,
                y: 0,
                width: stageImage.width,
                height: stageImage.height
            };

            const contentWidth = Math.round(trimBounds.width * state.scale);
            const contentHeight = Math.round(trimBounds.height * state.scale);
            const baseWidth = contentWidth + trimBorder * 2;
            const baseHeight = contentHeight + trimBorder * 2;
            const chartSize = Math.max(140, Math.round(Math.min(baseWidth, baseHeight) * 0.25));
            const margin = Math.round(chartSize * 0.08);

            const { row, col } = parsePlacementKey(state.flystarPlacement);
            const padTop = row === 0 ? chartSize + margin * 2 : 0;
            const padBottom = row === 4 ? chartSize + margin * 2 : 0;
            const padLeft = col === 0 ? chartSize + margin * 2 : 0;
            const padRight = col === 4 ? chartSize + margin * 2 : 0;

            const outputWidth = baseWidth + padLeft + padRight;
            const outputHeight = baseHeight + padTop + padBottom;
            const offsetX = padLeft;
            const offsetY = padTop;

            previewCanvas.width = outputWidth;
            previewCanvas.height = outputHeight;
            const ctx = previewCanvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outputWidth, outputHeight);
            const drawX = offsetX + trimBorder;
            const drawY = offsetY + trimBorder;
            ctx.drawImage(
                stageImage,
                trimBounds.x,
                trimBounds.y,
                trimBounds.width,
                trimBounds.height,
                drawX,
                drawY,
                contentWidth,
                contentHeight
            );

            const baseAreaX = offsetX + trimBorder;
            const baseAreaY = offsetY + trimBorder;
            const baseAreaRight = baseAreaX + contentWidth;
            const baseAreaBottom = baseAreaY + contentHeight;

            let chartX = margin;
            switch (col) {
                case 0:
                    chartX = margin;
                    break;
                case 1:
                    chartX = baseAreaX + margin;
                    break;
                case 2:
                    chartX = Math.round((outputWidth - chartSize) / 2);
                    break;
                case 3:
                    chartX = baseAreaRight - chartSize - margin;
                    break;
                case 4:
                    chartX = outputWidth - chartSize - margin;
                    break;
                default:
                    chartX = baseAreaX + margin;
            }

            let chartY = margin;
            switch (row) {
                case 0:
                    chartY = margin;
                    break;
                case 1:
                    chartY = baseAreaY + margin;
                    break;
                case 2:
                    chartY = Math.round((outputHeight - chartSize) / 2);
                    break;
                case 3:
                    chartY = baseAreaBottom - chartSize - margin;
                    break;
                case 4:
                    chartY = outputHeight - chartSize - margin;
                    break;
                default:
                    chartY = baseAreaY + margin;
            }
            if (!(row === 2 && col === 2)) {
                drawFlystar(ctx, chartX, chartY, chartSize, state.flystar);
                // Special case: center = dont draw
            }
            sizeValue.textContent = outputWidth + ' × ' + outputHeight + ' px';
            previewMeta.textContent = 'Preview ready • ' + outputWidth + ' × ' + outputHeight + 'px';
            downloadBtn.disabled = false;
            updatePreviewScale();
        };

        const updateStageCapture = async (compassMode?: SaveFile['compass']['mode']) => {
            downloadBtn.disabled = true;
            previewMeta.textContent = 'Capturing preview...';
            sizeValue.textContent = 'Loading...';

            // Draw a placeholder spinner on canvas
            const ctx = previewCanvas.getContext('2d');
            if (ctx) {
                const w = previewCanvas.width;
                const h = previewCanvas.height;
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, w, h);
                // Simple static spinner
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.1, 0, Math.PI * 1.5);
                ctx.lineWidth = Math.min(w, h) * 0.01;
                ctx.strokeStyle = '#44ccff';
                ctx.stroke();

                ctx.font = `${Math.min(w, h) * 0.04}px sans-serif`;
                ctx.fillStyle = '#333333';
                ctx.textAlign = 'center';
                ctx.fillText('Capturing preview...', w / 2, h / 2 + Math.min(w, h) * 0.2);
            }

            const capture = await captureStageData(compassMode);
            if (!capture) return;

            state.stageDataUrl = capture.dataUrl;
            state.stageWidth = capture.width;
            state.stageHeight = capture.height;
            state.compassMode = capture.compassMode;
            state.flystar = buildFlystarData();
            state.trimBounds = null;

            if (filenameInput.value.trim().length === 0) {
                filenameInput.value = optionsRef.current.filename || 'feng-shui-export';
            }

            stageImage.src = capture.dataUrl;

            if (state.trimEmpty) {
                const trimMode = state.compassMode === 'projections' ? 'visible' : state.compassMode;
                const trimCapture = trimMode === capture.compassMode ? capture : await captureStageData(trimMode);
                if (trimCapture) {
                    try {
                        state.trimBounds = await computeTrimBoundsFromDataUrl(trimCapture.dataUrl);
                    } catch {
                        state.trimBounds = null;
                    }
                }
                drawPreview();
            }
        };

        const closeModal = () => {
            closeFlystarPopover();
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', handleResize);
            modal.remove();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        const handleResize = () => {
            updatePreviewScale();
        };

        overlay?.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        });

        closeButton?.addEventListener('click', () => closeModal());
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', handleResize);

        filenameInput.value = optionsRef.current.filename || 'feng-shui-export';
        compassSelect.value = state.compassMode;
        trimCheckbox.checked = state.trimEmpty;

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

        trimCheckbox.addEventListener('change', () => {
            state.trimEmpty = trimCheckbox.checked;
            void updateStageCapture(state.compassMode);
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
            closeFlystarPopover();
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', handleOutsideClick);
            modal.remove();
        };
    }, [exportTrigger, stageRef, trRef]);
};
