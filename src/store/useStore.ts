import { create } from 'zustand';
import type { CanvasItem, FengShuiData, SaveFile } from '../types';
import { CURRENT_VERSION } from '../types';

interface ColorPreset {
    stroke: string;
    fill: string;
}

type ModifierKey = 'ctrl' | 'alt' | 'shift';
type TextSaveModifier = ModifierKey | 'none';

interface KeyboardShortcutConfig {
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

interface AppState {
    // Application Mode
    mode: 'welcome' | 'edit';
    setMode: (mode: 'welcome' | 'edit') => void;

    // Project Data
    filename: string;
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
    selectColorPreset: (index: number) => void;
    removeColorPreset: (index: number) => void;
    selectedPresetIndex: number | null;

    isDropperActive: boolean;
    setDropperActive: (active: boolean) => void;
    pickedColor: string | null;
    setPickedColor: (color: string | null) => void;

    // Log History
    history: string[];
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

const defaultFengShui: FengShuiData = {
    blacks: { start: 0 },
    reds: { start: 0, reversed: false },
    blues: { start: 0, reversed: false },
    purples: { start: 0, calculated_at: new Date() },
};

export const useStore = create<AppState>((set) => ({
    mode: 'welcome',
    setMode: (mode) => set({ mode }),

    filename: 'Untitled',
    version: CURRENT_VERSION,

    floorplan: {
        imageSrc: null,
        rotation: 0,
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
    },
    setFloorplanImage: (src) => set((state) => ({ floorplan: { ...state.floorplan, imageSrc: src } })),
    updateFloorplan: (updates) => set((state) => ({ floorplan: { ...state.floorplan, ...updates } })),

    objects: [],
    past: [],
    future: [],

    addItem: (item) => set((state) => {
        const newHistory = [`Added ${item.type}`, ...state.history].slice(0, 50);
        return {
            objects: [...state.objects, item],
            history: newHistory,
            past: [...state.past, state.objects],
            future: []
        };
    }),
    updateItem: (id, updates) => set((state) => {
        return {
            objects: state.objects.map((item) => (item.id === id ? { ...item, ...updates } : item)) as CanvasItem[],
            past: [...state.past, state.objects],
            future: []
        };
    }),
    updateItems: (ids, updates) => set((state) => {
        if (ids.length === 0) return {};
        const idSet = new Set(ids);
        return {
            objects: state.objects.map((item) => (idSet.has(item.id) ? { ...item, ...updates } : item)) as CanvasItem[],
            past: [...state.past, state.objects],
            future: []
        };
    }),
    moveItemsByDelta: (ids, delta) => set((state) => {
        if (ids.length === 0) return {};
        if (delta.x === 0 && delta.y === 0) return {};
        const idSet = new Set(ids);
        return {
            objects: state.objects.map((item) => (
                idSet.has(item.id)
                    ? { ...item, x: item.x + delta.x, y: item.y + delta.y }
                    : item
            )) as CanvasItem[],
            past: [...state.past, state.objects],
            future: []
        };
    }),
    moveItemsByDeltaTransient: (ids, delta) => set((state) => {
        if (ids.length === 0) return {};
        if (delta.x === 0 && delta.y === 0) return {};
        const idSet = new Set(ids);
        return {
            objects: state.objects.map((item) => (
                idSet.has(item.id)
                    ? { ...item, x: item.x + delta.x, y: item.y + delta.y }
                    : item
            )) as CanvasItem[]
        };
    }),
    commitHistory: (snapshot) => set((state) => ({
        past: [...state.past, snapshot],
        future: []
    })),
    removeItem: (id) => set((state) => ({
        objects: state.objects.filter((item) => item.id !== id),
        past: [...state.past, state.objects],
        future: []
    })),

    deleteSelected: () => set((state) => {
        if (state.selectedIds.length === 0) return {};
        return {
            objects: state.objects.filter((item) => !state.selectedIds.includes(item.id)),
            selectedIds: [],
            colors: state.selectionColorSnapshot ?? state.colors,
            selectionColorSnapshot: null,
            past: [...state.past, state.objects],
            future: []
        };
    }),

    undo: () => set((state) => {
        if (state.past.length === 0) return {};
        const newPast = [...state.past];
        const previous = newPast.pop();
        if (!previous) return {};
        return {
            objects: previous,
            past: newPast,
            future: [state.objects, ...state.future]
        };
    }),
    redo: () => set((state) => {
        if (state.future.length === 0) return {};
        const newFuture = [...state.future];
        const next = newFuture.shift();
        if (!next) return {};
        return {
            objects: next,
            past: [...state.past, state.objects],
            future: newFuture
        };
    }),

    cloneSelected: () => set((state) => {
        if (state.selectedIds.length === 0) return {};
        const toClone = state.objects.filter(i => state.selectedIds.includes(i.id));
        const newItems = toClone.map(item => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            x: item.x + 20,
            y: item.y + 20
        }));
        return {
            objects: [...state.objects, ...newItems],
            past: [...state.past, state.objects],
            future: [],
            selectedIds: newItems.map(i => i.id),
            activeTool: 'select'
        };
    }),

    moveSelectedLayer: (direction) => set((state) => {
        if (state.selectedIds.length === 0) return {};
        const newItems = [...state.objects];
        const id = state.selectedIds[0];
        const idx = newItems.findIndex(i => i.id === id);
        if (idx === -1) return {};

        if (direction === 'up' && idx < newItems.length - 1) {
            const temp = newItems[idx];
            newItems[idx] = newItems[idx + 1];
            newItems[idx + 1] = temp;
        } else if (direction === 'down' && idx > 0) {
            const temp = newItems[idx];
            newItems[idx] = newItems[idx - 1];
            newItems[idx - 1] = temp;
        }

        return {
            objects: newItems,
            past: [...state.past, state.objects],
            future: []
        };
    }),

    selectedIds: [],
    selectionColorSnapshot: null,
    selectItem: (id) => set((state) => {
        if (!id) {
            return {
                selectedIds: [],
                colors: state.selectionColorSnapshot ?? state.colors,
                selectionColorSnapshot: null
            };
        }

        const selectedItem = state.objects.find((item) => item.id === id);
        const snapshot = state.selectionColorSnapshot ?? state.colors;
        const nextColors = selectedItem
            ? { ...state.colors, stroke: selectedItem.stroke, fill: selectedItem.fill }
            : state.colors;

        return {
            selectedIds: [id],
            selectionColorSnapshot: snapshot,
            colors: nextColors
        };
    }),
    toggleSelectItem: (id) => set((state) => {
        const isSelected = state.selectedIds.includes(id);
        const nextSelectedIds = isSelected
            ? state.selectedIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedIds, id];

        if (nextSelectedIds.length === 0) {
            return {
                selectedIds: [],
                colors: state.selectionColorSnapshot ?? state.colors,
                selectionColorSnapshot: null
            };
        }

        const anchorId = isSelected ? nextSelectedIds[nextSelectedIds.length - 1] : id;
        const anchorItem = state.objects.find((item) => item.id === anchorId);
        const snapshot = state.selectionColorSnapshot ?? state.colors;
        const nextColors = anchorItem
            ? { ...state.colors, stroke: anchorItem.stroke, fill: anchorItem.fill }
            : state.colors;

        return {
            selectedIds: nextSelectedIds,
            selectionColorSnapshot: snapshot,
            colors: nextColors
        };
    }),
    clearSelection: () => set((state) => ({
        selectedIds: [],
        colors: state.selectionColorSnapshot ?? state.colors,
        selectionColorSnapshot: null
    })),

    fengShui: defaultFengShui,
    updateFengShui: (updates) => set((state) => ({ fengShui: { ...state.fengShui, ...updates } })),
    showFlyStar: false,
    toggleFlyStar: () => set((state) => ({ showFlyStar: !state.showFlyStar })),

    compass: {
        visible: true,
        mode: 'visible',
        rotation: 0,
        opacity: 1.0,
        x: 400,
        y: 300,
        radius: 200,
        locked: true
    },
    toggleCompass: () => set((state) => {
        const modes = ['hidden', 'visible', 'interactive', 'projections'] as const;
        const currentMode = state.compass.mode || (state.compass.visible ? 'visible' : 'hidden');
        const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];

        return {
            compass: {
                ...state.compass,
                visible: nextMode !== 'hidden',
                mode: nextMode
            }
        };
    }),
    updateCompass: (updates) => set((state) => ({ compass: { ...state.compass, ...updates } })),
    setCompassRotation: (rotation) => set((state) => ({ compass: { ...state.compass, rotation } })),

    activeTool: 'select',
    setActiveTool: (tool) => set((state) => {
        // Show settings popup if clicking the same tool
        if (state.activeTool === tool && tool !== 'select') {
            return { showToolSettings: true };
        }
        return { activeTool: tool, showToolSettings: false };
    }),
    toolSettings: {
        lineWidth: 2,
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        textColor: '#000000',
    },
    setToolSettings: (settings) => set((state) => ({ toolSettings: { ...state.toolSettings, ...settings } })),
    showToolSettings: false,
    setShowToolSettings: (show) => set({ showToolSettings: show }),

    showProjectConfig: false,
    setShowProjectConfig: (show) => set({ showProjectConfig: show }),

    colors: { stroke: '#000000', fill: 'transparent', active: 'stroke' },
    setColors: (colors) => set((state) => {
        const nextColors = { ...state.colors, ...colors };
        const shouldUpdateSelection =
            state.selectedIds.length > 0 &&
            (Object.prototype.hasOwnProperty.call(colors, 'stroke') || Object.prototype.hasOwnProperty.call(colors, 'fill'));

        if (!shouldUpdateSelection) {
            return {
                colors: nextColors,
                selectedPresetIndex: null
            };
        }

        const idSet = new Set(state.selectedIds);
        return {
            colors: nextColors,
            selectedPresetIndex: null,
            objects: state.objects.map((item) => (
                idSet.has(item.id)
                    ? {
                        ...item,
                        stroke: nextColors.stroke,
                        fill: nextColors.fill
                    }
                    : item
            )) as CanvasItem[],
            past: [...state.past, state.objects],
            future: []
        };
    }),

    colorPresets: [
        // stroke in RGB, fill in RGBA
        { stroke: '#000000', fill: '#FFFFFFB2' },
        { stroke: '#FF0000', fill: '#FFFFFFB2' },
        { stroke: '#FF0000', fill: '#FFFF00B2' },
        { stroke: '#0000FF', fill: '#FFFFFFB2' },
        { stroke: '#00FF00', fill: '#FFFFFFB2' },
        { stroke: '#FF00FF', fill: '#FFFFFFB2' },
        { stroke: '#00FFFF', fill: '#FFFFFFB2' },


    ],
    addColorPreset: (preset) => set((state) => {
        if (state.colorPresets.length >= 8) return {};
        return { colorPresets: [...state.colorPresets, preset] };
    }),
    selectColorPreset: (index) => set((state) => {
        if (index < 0 || index >= state.colorPresets.length) return {};
        const preset = state.colorPresets[index];
        const nextColors = { ...state.colors, stroke: preset.stroke, fill: preset.fill };
        const shouldUpdateSelection = state.selectedIds.length > 0;

        if (!shouldUpdateSelection) {
            return {
                colors: nextColors,
                selectedPresetIndex: index
            };
        }

        const idSet = new Set(state.selectedIds);
        return {
            colors: nextColors,
            selectedPresetIndex: index,
            objects: state.objects.map((item) => (
                idSet.has(item.id)
                    ? {
                        ...item,
                        stroke: nextColors.stroke,
                        fill: nextColors.fill
                    }
                    : item
            )) as CanvasItem[],
            past: [...state.past, state.objects],
            future: []
        };
    }),
    removeColorPreset: (index) => set((state) => {
        if (index < 0 || index >= state.colorPresets.length) return {};
        const newPresets = state.colorPresets.filter((_, i) => i !== index);
        return {
            colorPresets: newPresets,
            selectedPresetIndex: state.selectedPresetIndex === index ? null : state.selectedPresetIndex
        };
    }),
    selectedPresetIndex: null,

    isDropperActive: false,
    setDropperActive: (active) => set({ isDropperActive: active }),
    pickedColor: null,
    setPickedColor: (color) => set({ pickedColor: color }),

    history: [],
    addToHistory: (action) => set((state) => ({ history: [action, ...state.history].slice(0, 50) })),

    loadProject: (data) => {
        set({
            mode: 'edit',
            floorplan: data.floorplan,
            objects: data.objects,
            fengShui: data.fengShui,
            compass: {
                ...data.compass,
                locked: (data.compass as any).locked ?? true
            },
            history: ['Loaded Project'],
            past: [],
            future: [],
            selectedIds: [],
            selectionColorSnapshot: null
        });
    },

    resetProject: () => set({
        mode: 'edit',
        floorplan: { imageSrc: null, rotation: 0, scale: 1, opacity: 1, x: 0, y: 0 },
        objects: [],
        fengShui: defaultFengShui,
        history: ['New Project'],
        showFlyStar: false,
        past: [],
        future: [],
        selectedIds: [],
        selectionColorSnapshot: null
    }),

    autoSave: true,
    toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
    lastAutoSaveAt: null,
    setLastAutoSaveAt: (timestamp) => set({ lastAutoSaveAt: timestamp }),

    exportTrigger: 0,
    triggerExport: () => set((state) => ({ exportTrigger: state.exportTrigger + 1 })),

    keyboardShortcuts: {
        modifyKey: 'ctrl',
        cancelKey: 'Escape',
        textSave: {
            modifier: 'ctrl',
            key: 'Enter'
        },
        tools: {
            select: 'v',
            rectangle: 'm',
            ellipse: 'l',
            line: 'p',
            arrow: 'a',
            callout: 'c',
            star: 's',
            text: 't',
            dropper: 'i'
        }
    },
    setModifyKey: (key) => set((state) => ({
        keyboardShortcuts: { ...state.keyboardShortcuts, modifyKey: key }
    })),
    setCancelKey: (key) => set((state) => ({
        keyboardShortcuts: { ...state.keyboardShortcuts, cancelKey: key }
    })),
    setTextSaveShortcut: (modifier, key) => set((state) => ({
        keyboardShortcuts: {
            ...state.keyboardShortcuts,
            textSave: { modifier, key }
        }
    })),
    setToolShortcut: (tool, key) => set((state) => ({
        keyboardShortcuts: {
            ...state.keyboardShortcuts,
            tools: {
                ...state.keyboardShortcuts.tools,
                [tool]: key
            }
        }
    })),
}));
