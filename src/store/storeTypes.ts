import type { StateCreator } from 'zustand';
import type { CanvasItem, FengShuiData, SaveFile } from '../types';

export interface ColorPreset {
    stroke: string;
    fill: string;
}

export type ModifierKey = 'ctrl' | 'alt' | 'shift';
export type TextSaveModifier = ModifierKey | 'none';

export interface KeyboardShortcutConfig {
    modifyKey: ModifierKey;
    cancelKey: string;
    textSave: {
        modifier: TextSaveModifier;
        key: string;
    };
    tools: {
        select: string;
        rectangle: string;
        ellipse: string;
        line: string;
        arrow: string;
        callout: string;
        star: string;
        text: string;
        dropper: string;
    };
}

export interface AppState {
    // Application Mode
    mode: 'welcome' | 'edit';
    setMode: (mode: 'welcome' | 'edit') => void;

    // Project Data
    projectName: string;
    setProjectName: (name: string) => void;
    saveFileName: string | null;
    setSaveFileName: (name: string | null) => void;
    fileHandle: FileSystemFileHandle | null;
    setFileHandle: (handle: FileSystemFileHandle | null) => void;
    lastSavedAt: number | null;
    setLastSavedAt: (timestamp: number | null) => void;
    version: string;
    floorplan: SaveFile['floorplan'];
    setFloorplanImage: (src: string) => void;
    updateFloorplan: (updates: Partial<SaveFile['floorplan']>) => void;

    // Canvas Objects
    objects: CanvasItem[];
    addItem: (item: CanvasItem) => void;
    updateItem: (id: string, updates: Partial<CanvasItem>) => void;
    updateItems: (ids: string[], updates: Partial<CanvasItem>) => void;
    moveItemsByDelta: (ids: string[], delta: { x: number; y: number }) => void;
    moveItemsByDeltaTransient: (ids: string[], delta: { x: number; y: number }) => void;
    commitHistory: (snapshot: CanvasItem[]) => void;
    removeItem: (id: string) => void;
    deleteSelected: () => void;
    selectedIds: string[];
    selectItem: (id: string | null) => void;
    toggleSelectItem: (id: string) => void;
    clearSelection: () => void;

    // History (Undo/Redo)
    past: CanvasItem[][];
    future: CanvasItem[][];
    undo: () => void;
    redo: () => void;

    // Edit Operations
    cloneSelected: () => void;
    moveSelectedLayer: (direction: 'up' | 'down') => void;

    // Feng Shui Data
    fengShui: FengShuiData;
    updateFengShui: (updates: Partial<FengShuiData>) => void;
    showFlyStar: boolean;
    toggleFlyStar: () => void;

    // UI State
    compass: SaveFile['compass'];
    toggleCompass: () => void;
    updateCompass: (updates: Partial<SaveFile['compass']>) => void;
    setCompassRotation: (deg: number) => void;

    // Tool State
    activeTool: 'select' | 'rectangle' | 'ellipse' | 'line' | 'star' | 'arrow' | 'text' | 'callout';
    setActiveTool: (tool: AppState['activeTool']) => void;
    toolSettings: {
        lineWidth: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: 'normal' | 'bold';
        fontStyle: 'normal' | 'italic';
        textAlign: 'left' | 'center' | 'right';
        textColor: string;
    };
    setToolSettings: (settings: Partial<AppState['toolSettings']>) => void;
    showToolSettings: boolean;
    setShowToolSettings: (show: boolean) => void;

    // Project Config Modal
    showProjectConfig: boolean;
    setShowProjectConfig: (show: boolean) => void;

    // Color State
    colors: { stroke: string; fill: string; active: 'stroke' | 'fill' };
    setColors: (colors: Partial<AppState['colors']>) => void;
    selectionColorSnapshot: { stroke: string; fill: string; active: 'stroke' | 'fill' } | null;
    // Saved Color Presets (Max 8) - stores both stroke and fill
    colorPresets: ColorPreset[];
    addColorPreset: (preset: ColorPreset) => void;
    updateColorPreset: (index: number, updates: Partial<ColorPreset>) => void;
    selectColorPreset: (index: number) => void;
    removeColorPreset: (index: number) => void;
    selectedPresetIndex: number | null;

    isDropperActive: boolean;
    setDropperActive: (active: boolean) => void;
    pickedColor: string | null;
    setPickedColor: (color: string | null) => void;

    // Log History
    history: string[];
    historyUndoCount: number;
    addToHistory: (action: string) => void;

    // Actions
    loadProject: (data: SaveFile) => void;
    resetProject: () => void;

    // AutoSave
    autoSave: boolean;
    toggleAutoSave: () => void;
    lastAutoSaveAt: number | null;
    setLastAutoSaveAt: (timestamp: number | null) => void;

    // Export
    exportTrigger: number;
    triggerExport: () => void;

    // Keyboard Shortcuts
    keyboardShortcuts: KeyboardShortcutConfig;
    setModifyKey: (key: ModifierKey) => void;
    setCancelKey: (key: string) => void;
    setTextSaveShortcut: (modifier: TextSaveModifier, key: string) => void;
    setToolShortcut: (tool: keyof KeyboardShortcutConfig['tools'], key: string) => void;
}

export type StoreSlice = StateCreator<AppState, [], [], Partial<AppState>>;
