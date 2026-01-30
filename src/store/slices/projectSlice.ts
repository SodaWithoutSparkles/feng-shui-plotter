import { CURRENT_VERSION } from '../../types';
import type { SaveFile } from '../../types';
import type { StoreSlice } from '../storeTypes';
import { defaultFengShui } from '../storeDefaults';

export const createProjectSlice: StoreSlice = (set) => ({
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

    loadProject: (data: SaveFile) => {
        set({
            mode: 'edit',
            floorplan: data.floorplan,
            objects: data.objects,
            fengShui: {
                ...data.fengShui,
                purples: { ...data.fengShui.purples, offset: 0 }
            },
            compass: {
                ...data.compass,
                locked: (data.compass as any).locked ?? true
            },
            history: ['Loaded Project'],
            historyUndoCount: 0,
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
        historyUndoCount: 0,
        showFlyStar: false,
        past: [],
        future: [],
        selectedIds: [],
        selectionColorSnapshot: null
    }),
});
