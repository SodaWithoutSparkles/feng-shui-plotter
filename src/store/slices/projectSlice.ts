import { CURRENT_VERSION } from '../../types';
import type { SaveFile } from '../../types';
import type { StoreSlice } from '../storeTypes';
import { defaultFengShui } from '../storeDefaults';
import { createDefaultProjectName } from '../../utils/projectName';

export const createProjectSlice: StoreSlice = (set) => ({
    mode: 'welcome',
    setMode: (mode) => set({ mode }),

    projectName: createDefaultProjectName(),
    setProjectName: (name) => set({ projectName: name }),
    saveFileName: null,
    setSaveFileName: (name) => set({ saveFileName: name }),
    fileHandle: null,
    setFileHandle: (handle) => set({ fileHandle: handle }),
    lastSavedAt: null,
    setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
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
        set((state) => ({
            mode: state.mode === 'view' ? 'view' : 'edit',
            floorplan: data.floorplan,
            objects: data.objects,
            projectName: data.projectName ?? state.projectName,
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
            selectionColorSnapshot: null,
            hasPerformedClearAll: false
        }));
    },

    resetProject: () => set({
        mode: 'edit',
        projectName: createDefaultProjectName(),
        saveFileName: null,
        fileHandle: null,
        lastSavedAt: null,
        floorplan: { imageSrc: null, rotation: 0, scale: 1, opacity: 1, x: 0, y: 0 },
        objects: [],
        compass: {
            visible: true,
            mode: 'visible',
            rotation: 0,
            opacity: 0.9,
            x: 0,
            y: 0,
            radius: 200,
            locked: true
        },
        fengShui: defaultFengShui,
        history: ['New Project'],
        historyUndoCount: 0,
        showFlyStar: true,
        past: [],
        future: [],
        selectedIds: [],
        selectionColorSnapshot: null,
        hasPerformedClearAll: false
    }),
});
