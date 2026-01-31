import type { StoreSlice } from '../storeTypes';

export const createCompassSlice: StoreSlice = (set) => ({
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
});
