import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export const KeyboardShortcuts = () => {
    const undo = useStore((state) => state.undo);
    const redo = useStore((state) => state.redo);
    const cloneSelected = useStore((state) => state.cloneSelected);
    const deleteSelected = useStore((state) => state.deleteSelected);
    const moveSelectedLayer = useStore((state) => state.moveSelectedLayer);
    const setActiveTool = useStore((state) => state.setActiveTool);
    const setDropperActive = useStore((state) => state.setDropperActive);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input field
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Ctrl/Cmd + Z - Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }

            // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z - Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
                return;
            }

            // Ctrl/Cmd + D - Clone
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                cloneSelected();
                return;
            }

            // Delete or Backspace - Delete selected
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelected();
                return;
            }

            // [ - Move layer down
            if (e.key === '[') {
                e.preventDefault();
                moveSelectedLayer('down');
                return;
            }

            // ] - Move layer up
            if (e.key === ']') {
                e.preventDefault();
                moveSelectedLayer('up');
                return;
            }

            // Tool shortcuts (only when no modifier keys are pressed)
            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                switch (e.key.toLowerCase()) {
                    case 'v':
                        e.preventDefault();
                        setActiveTool('select');
                        setDropperActive(false);
                        break;
                    case 'm':
                        e.preventDefault();
                        setActiveTool('rectangle');
                        setDropperActive(false);
                        break;
                    case 'l':
                        e.preventDefault();
                        setActiveTool('ellipse');
                        setDropperActive(false);
                        break;
                    case 'p':
                        e.preventDefault();
                        setActiveTool('line');
                        setDropperActive(false);
                        break;
                    case 'a':
                        e.preventDefault();
                        setActiveTool('arrow');
                        setDropperActive(false);
                        break;
                    case 'c':
                        e.preventDefault();
                        setActiveTool('callout');
                        setDropperActive(false);
                        break;
                    case 's':
                        e.preventDefault();
                        setActiveTool('star');
                        setDropperActive(false);
                        break;
                    case 't':
                        e.preventDefault();
                        setActiveTool('text');
                        setDropperActive(false);
                        break;
                    case 'i':
                        e.preventDefault();
                        setDropperActive(true);
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, cloneSelected, deleteSelected, moveSelectedLayer, setActiveTool, setDropperActive]);

    return null;
};
