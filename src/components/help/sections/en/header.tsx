import type { HelpSection } from '../types';

export const headerHelpSection: HelpSection = {
    id: 'header',
    title: 'Top Menu',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The top menu bar provides file management, editing operations, and global settings.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">File</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">New Project:</span> Creates a new project (clears current canvas).</li>
                    <li><span className="text-gray-100 font-semibold">Open Project:</span> Opens a local .fsp project file.</li>
                    <li><span className="text-gray-100 font-semibold">Save Project:</span> Saves current progress. If supported (Chrome/Edge), overwrites the original file; otherwise downloads a new file. See <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'saveExport' }))}>Save & Export</span>.</li>
                    <li><span className="text-gray-100 font-semibold">Save Project As...:</span> Always downloads as a new file.</li>
                    <li><span className="text-gray-100 font-semibold">Auto-save:</span> Toggles auto-save. It saves the project state after every operation to prevent data loss from crashes or accidental closures. It only keeps the latest state, has no version history, and does not upload to any cloud service.</li>
                    <li><span className="text-gray-100 font-semibold">Configure Project:</span> Modify floorplan image, orientation, and Flying Star settings.</li>
                    <li><span className="text-gray-100 font-semibold">Export as Image:</span> Exports the current canvas as an image.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Edit</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Undo/Redo:</span> Undo or redo the last action.</li>
                    <li><span className="text-gray-100 font-semibold">Clone Object:</span> Duplicates the selected object.</li>
                    <li><span className="text-gray-100 font-semibold">Delete Selected:</span> Deletes the selected object.</li>
                    <li><span className="text-gray-100 font-semibold">Move Up/Down:</span> Adjusts layer order.</li>
                    <li><span className="text-gray-100 font-semibold">Insert Image:</span> Inserts a local or remote image onto the canvas.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Options</h4>
                <p className="text-gray-300">Provides Compass locking, opacity, and radius adjustments, as well as Keyboard Shortcuts list.</p>
            </div>
        </div>
    )
};
