import type { HelpSection } from '../types';

export const toolsHelpSection: HelpSection = {
    id: 'tools',
    title: 'Tools',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The left sidebar contains the drawing and selection tools. Use the tool buttons to switch modes and
                create objects on the canvas.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">What each tool does</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Select:</span> Select and move objects. Ctrl+click adds or removes from selection.</li>
                    <li><span className="text-gray-100 font-semibold">Rectangle:</span> Draw rectangular shapes.</li>
                    <li><span className="text-gray-100 font-semibold">Ellipse:</span> Draw ellipses and circles.</li>
                    <li><span className="text-gray-100 font-semibold">Line:</span> Draw straight line segments.</li>
                    <li><span className="text-gray-100 font-semibold">Arrow:</span> Draw arrows. Press Space while dragging to add extra segments.</li>
                    <li><span className="text-gray-100 font-semibold">Callout:</span> Place a text box with an arrow. Press Space to switch from box to arrow, then Space again for extra arrow segments.</li>
                    <li><span className="text-gray-100 font-semibold">Star:</span> Draw a five-point star with adjustable size.</li>
                    <li><span className="text-gray-100 font-semibold">Text:</span> Draw a text box, then type in the editor overlay.</li>
                    <li><span className="text-gray-100 font-semibold">Color Dropper:</span> Sample a stroke or fill color from the canvas.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Modifier keys</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Constrain:</span> Hold the configured modifier key to draw perfect squares/circles or lock lines/arrows to horizontal/vertical.</li>
                    <li><span className="text-gray-100 font-semibold">Cancel:</span> Press the cancel key (default Esc) to abort a drawing or text edit.</li>
                    <li><span className="text-gray-100 font-semibold">Text save:</span> Use the configured save shortcut to commit text edits.</li>
                </ul>
                <p className="text-gray-400">
                    Configure these keys in Options → Keyboard Shortcuts.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tool settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Shape tools:</span> Line width.</li>
                    <li><span className="text-gray-100 font-semibold">Text/Callout:</span> Font size, family, weight, style, alignment, and text color.</li>
                </ul>
                <p className="text-gray-400">
                    The tool settings panel opens next to the active tool in the left sidebar.
                </p>
            </div>
        </div>
    )
};
