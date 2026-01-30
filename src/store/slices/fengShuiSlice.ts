import { defaultFengShui } from '../storeDefaults';
import type { StoreSlice } from '../storeTypes';

export const createFengShuiSlice: StoreSlice = (set) => ({
    fengShui: defaultFengShui,
    updateFengShui: (updates) => set((state) => ({ fengShui: { ...state.fengShui, ...updates } })),
    showFlyStar: true,
    toggleFlyStar: () => set((state) => ({ showFlyStar: !state.showFlyStar })),
});
