import type { HelpSection } from '../types';

export const objectsHelpSection: HelpSection = {
    id: 'objects',
    title: 'Object Operations',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                Learn how to efficiently select, edit, and manage objects.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Select</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Single Select:</span> Click an object with the Select tool (arrow cursor), or select it from the Objects list in the right panel.</li>
                    <li><span className="text-gray-100 font-semibold">Add/Remove Select:</span> Hold Ctrl and click objects (on canvas or in list) to add or remove them from the selection.</li>
                    <li><span className="text-gray-100 font-semibold">Select All:</span> Press Ctrl + A in the Objects list to select all objects.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Move & Edit</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Drag Move:</span> Select and drag objects directly to move them.</li>
                    <li>
                        <span className="text-gray-100 font-semibold">Bulk Edit:</span>
                        When multiple objects are selected, the right panel shows common properties. Adjusting color, stroke, or font size applies to all selected objects.
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Delete & Clone</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Delete:</span> Press Delete or Backspace key.</li>
                    <li><span className="text-gray-100 font-semibold">Clone:</span> Press Ctrl + D to duplicate selected objects.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Clear All</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Clear All Objects:</span> Click the trash can icon on the right side of the Objects panel header to delete all objects on the canvas at once.</li>
                </ul>
            </div>

            <p className="text-gray-400 text-xs mt-2">
                For more info, see <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'panel' }))}>Panel</span> and <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'header' }))}>Top Menu</span> sections.
            </p>
        </div>
    )
};
