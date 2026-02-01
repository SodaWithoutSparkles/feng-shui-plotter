import type { HelpSection } from '../types';

export const toolsHelpSection: HelpSection = {
    id: 'tools',
    title: 'Tools',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The left sidebar contains drawing and selection tools. Use buttons to switch modes and create objects on the canvas.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tool Descriptions</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Select:</span> Select and move objects. Ctrl+Click to add/remove from selection.</li>
                    <li><span className="text-gray-100 font-semibold">Rectangle:</span> Draw rectangular shapes. Hold modifier key to constrain to a square.</li>
                    <li><span className="text-gray-100 font-semibold">Ellipse:</span> Draw ellipses. Hold modifier key to constrain to a circle.</li>
                    <li><span className="text-gray-100 font-semibold">Line:</span> Draw lines. Press Space while dragging to add segments.</li>
                    <li><span className="text-gray-100 font-semibold">Arrow:</span> Draw arrows. Press Space while dragging to add segments.</li>
                    <li><span className="text-gray-100 font-semibold">Callout:</span> Place text boxes with arrows. Drag to draw box, press Space for arrow, press Space again for more segments.</li>
                    <li><span className="text-gray-100 font-semibold">Star:</span> Draw resizable 5-pointed stars.</li>
                    <li><span className="text-gray-100 font-semibold">Text:</span> Draw a text box, then type in the editor overlay.</li>
                    <li><span className="text-gray-100 font-semibold">Color Dropper:</span> Sample stroke or fill colors from the canvas.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Modifiers & Shortcuts</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Constrain:</span> Hold the configured modifier (default Ctrl) to square/circle or snap lines/arrows to 45° increments.</li>
                    <li><span className="text-gray-100 font-semibold">Cancel:</span> Press Cancel key (default Esc) to abort drawing or text editing.</li>
                    <li><span className="text-gray-100 font-semibold">Delete:</span> Delete selected objects.</li>
                    <li><span className="text-gray-100 font-semibold">Layer Order:</span> Use <code className="bg-gray-700 px-1 rounded text-xs">]</code> to move up, <code className="bg-gray-700 px-1 rounded text-xs">[</code> to move down.</li>
                    <li><span className="text-gray-100 font-semibold">Duplicate:</span> Ctrl+D (or Cmd+D) to duplicate selected objects.</li>
                    <li><span className="text-gray-100 font-semibold">Text Save:</span> Use Save shortcut (default Ctrl+Enter) to commit text edits. Clicking outside also saves.</li>
                </ul>
                <p className="text-gray-400">
                    Customize these in Options → Keyboard Shortcuts.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tool Settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">All Tools:</span> Line width.</li>
                    <li><span className="text-gray-100 font-semibold">Text/Callout:</span> Font size, family, style, color, etc.</li>
                </ul>
                <p className="text-gray-400">
                    Tool settings appear next to the active tool in the sidebar.
                </p>
            </div>
        </div>
    )
};
