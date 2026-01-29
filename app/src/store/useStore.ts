// src/store/useStore.ts

import { create } from 'zustand';
import type { CanvasItem, FengShuiData, SaveFile } from '../types';
import { CURRENT_VERSION } from '../types';

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
    items: CanvasItem[];
    addItem: (item: CanvasItem) => void;
    updateItem: (id: string, updates: Partial<CanvasItem>) => void;
    removeItem: (id: string) => void;
    selectedIds: string[];
    selectItem: (id: string | null) => void;

    // Feng Shui Data
    fengShui: FengShuiData;
    updateFengShui: (updates: Partial<FengShuiData>) => void;
    showFlyStar: boolean;
    toggleFlyStar: () => void;

    // UI State
    compass: SaveFile['compass'];
    toggleCompass: () => void;
    setCompassRotation: (deg: number) => void;

    // Tool State
    activeTool: 'select' | 'rectangle' | 'ellipse' | 'line' | 'star' | 'arrow' | 'text';
    setActiveTool: (tool: AppState['activeTool']) => void;

    // History State
    history: string[]; // Placeholder for action descriptions
    addToHistory: (action: string) => void;

    // Actions
    loadProject: (data: SaveFile) => void;
    resetProject: () => void;
}

const defaultFengShui: FengShuiData = {
    blacks: { start: 0 },
    reds: { start: 0, reversed: false },
    blues: { start: 0, reversed: false },
    purples: { start: 0, calculated_at: new Date },
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

    items: [],
    addItem: (item) => set((state) => {
        const newHistory = [`Added ${item.type}`, ...state.history].slice(0, 50);
        return { items: [...state.items, item], history: newHistory };
    }),
    updateItem: (id, updates) => set((state) => ({
        // @ts-ignore: Complex union type spread issues
        items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)) as CanvasItem[],
    })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

    selectedIds: [],
    selectItem: (id) => set({ selectedIds: id ? [id] : [] }),

    fengShui: defaultFengShui,
    updateFengShui: (updates) => set((state) => ({ fengShui: { ...state.fengShui, ...updates } })),
    showFlyStar: false,
    toggleFlyStar: () => set((state) => ({ showFlyStar: !state.showFlyStar })),

    compass: {
        visible: true,
        rotation: 0,
        opacity: 0.5,
    },
    toggleCompass: () => set((state) => ({ compass: { ...state.compass, visible: !state.compass.visible } })),
    setCompassRotation: (rotation) => set((state) => ({ compass: { ...state.compass, rotation } })),

    activeTool: 'select',
    setActiveTool: (tool) => set({ activeTool: tool }),

    history: [],
    addToHistory: (action) => set((state) => ({ history: [action, ...state.history].slice(0, 50) })),

    loadProject: (data) => {
        set({
            mode: 'edit',
            floorplan: data.floorplan,
            items: data.objects,
            fengShui: data.fengShui,
            compass: data.compass,
            history: ['Loaded Project'],
        });
    },

    resetProject: () => set({
        mode: 'edit',
        floorplan: { imageSrc: null, rotation: 0, scale: 1, opacity: 1, x: 0, y: 0 },
        items: [],
        fengShui: defaultFengShui,
        history: ['New Project'],
        showFlyStar: false,
    }),
}));
