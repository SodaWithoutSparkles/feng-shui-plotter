import { create } from 'zustand';
import type { AppState } from './storeTypes';
import { createCanvasSlice } from './slices/canvasSlice';
import { createColorsSlice } from './slices/colorsSlice';
import { createCompassSlice } from './slices/compassSlice';
import { createFengShuiSlice } from './slices/fengShuiSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import { createProjectSlice } from './slices/projectSlice';
import { createToolsSlice } from './slices/toolsSlice';

export const useStore = create<AppState>((set, get) => ({
    ...createProjectSlice(set, get),
    ...createCanvasSlice(set, get),
    ...createFengShuiSlice(set, get),
    ...createCompassSlice(set, get),
    ...createToolsSlice(set, get),
    ...createColorsSlice(set, get),
    ...createPreferencesSlice(set, get),
}));
