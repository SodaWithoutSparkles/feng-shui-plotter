import { useState, useEffect } from 'react';

export const useKeyboardModifiers = (activeTool: string, isDrawing: boolean) => {
    const [isAltPressed, setIsAltPressed] = useState(false);
    const [isPolylineMode, setIsPolylineMode] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt') {
                setIsAltPressed(true);
            }
            if (e.key === ' ' && activeTool === 'arrow' && isDrawing) {
                e.preventDefault();
                setIsPolylineMode(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt') {
                setIsAltPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [activeTool, isDrawing]);

    return { isAltPressed, isPolylineMode, setIsPolylineMode };
};
