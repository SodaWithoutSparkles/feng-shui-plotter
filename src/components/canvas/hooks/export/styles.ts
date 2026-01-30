
export const getExportModalStyles = () => `
    * { box-sizing: border-box; }
    .export-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); display: flex; align-items: center; justify-content: center; z-index: 9999; }
    .export-window { width: min(1200px, 94vw); height: min(800px, 94vh); background: #0f172a; color: #e2e8f0; border-radius: 16px; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.45); display: flex; flex-direction: column; overflow: hidden; border: 1px solid #1f2937; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
    .export-header { padding: 14px 18px; display: flex; align-items: center; justify-content: flex-start; gap: 8px; background: #111827; border-bottom: 1px solid #1f2937; }
    .export-header h1 { margin: 0; font-size: 16px; font-weight: 700; margin-right: auto; }
    .export-close { border: none; background: #ef4444; color: #ffffff; font-size: 14px; cursor: pointer; padding: 6px 10px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; margin-left: 8px; }
    .export-close:hover { filter: brightness(0.95); }
    .export-download { border: none; background: #38bdf8; color: #0f172a; font-size: 14px; cursor: pointer; padding: 6px 10px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; margin-left: 8px; }
    .export-download:hover { filter: brightness(0.95); }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: 100%; }
    .preview { padding: 24px; display: flex; flex-direction: column; gap: 10px; min-height: 0; }
    .preview-viewport { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 12px; border: 1px solid #1f2937; background: #0f172a; --preview-scale: 1; }
    .preview-viewport .preview-canvas { display: block; transform: scale(var(--preview-scale)); transform-origin: center; background: #0f172a; border-radius: 12px; border: 1px solid #1f2937; }
    .panel { padding: 24px; background: #111827; border-left: 1px solid #1f2937; display: flex; flex-direction: column; gap: 16px; }
    .card { background: #0b1220; border: 1px solid #1f2937; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
    .flystar-config { position: relative; }
    .flystar-trigger { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .flystar-trigger:hover { border-color: #38bdf8; }
    .flystar-trigger span { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
    
    /* Updated Flystar Popover Styles */
    .flystar-popover { 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        margin-top: 0; 
        background: #0b1220; 
        border: 1px solid #1f2937; 
        border-radius: 16px; 
        padding: 24px; 
        box-shadow: 0 0 0 100vmax rgba(0,0,0,0.5), 0 20px 60px rgba(0, 0, 0, 0.5); 
        display: none; 
        z-index: 10000; 
        width: 90vw;
        max-width: 400px;
    }
    .flystar-popover.open { display: block; animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
    
    @keyframes popIn {
        from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    .flystar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
    .flystar-cell { 
        aspect-ratio: 1; 
        border-radius: 8px; 
        border: 1px solid #1f2937; 
        background: #0f172a; 
        color: #94a3b8; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 14px; 
        font-weight: 500;
        cursor: pointer; 
        transition: all 0.15s ease;
        min-height: 44px;
    }
    .flystar-cell:hover { border-color: #38bdf8; color: #e2e8f0; transform: scale(1.05); }
    .flystar-cell.extend { background: rgba(59, 130, 246, 0.08); }
    .flystar-cell.center { background: rgba(56, 189, 248, 0.16); color: #0f172a; font-weight: 700; border-color: rgba(56, 189, 248, 0.3); }
    .flystar-cell.active { border-color: #38bdf8; background: #38bdf8; color: #0f172a; font-weight: 700; box-shadow: 0 0 12px rgba(56, 189, 248, 0.4); transform: scale(1.05); z-index: 2; }
    
    label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
    .row { display: flex; gap: 8px; align-items: center; }
    input, select { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; }
    input[type=range] { width: 100%; }
    .value { font-size: 12px; color: #cbd5f5; }
    .hint { font-size: 11px; color: #94a3b8; }
    .button { padding: 10px 14px; border-radius: 10px; border: none; background: #38bdf8; color: #0f172a; font-weight: 700; cursor: pointer; }
    .button:disabled { opacity: 0.5; cursor: not-allowed; }
    .export-window canvas { max-width: none; max-height: none; }
    .preview-meta { margin-top: 10px; font-size: 12px; color: #94a3b8; }
    @media (max-width: 1024px) {
        .layout { grid-template-columns: 1fr; }
        .panel { border-left: none; border-top: 1px solid #1f2937; }
    }
`;
