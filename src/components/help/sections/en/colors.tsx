import type { HelpSection } from '../types';

export const colorsHelpSection: HelpSection = {
    id: 'colors',
    title: 'Colors',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The dual color picker controls stroke (outline) and fill colors for new shapes and selected objects.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Picking colors</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>Click the upper-left triangle to edit the stroke color.</li>
                    <li>Click the lower-right triangle to edit the fill color (supports transparency).</li>
                    <li>Use the pipette to sample a color directly from the canvas.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Presets</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>Click a preset to apply its stroke/fill pair.</li>
                    <li>Click the selected preset again to edit it.</li>
                    <li>Use the + button to save the current stroke/fill pair as a new preset.</li>
                </ul>
            </div>

            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">Note:</strong> Text (font) colors are not configured here.
                Use the Text tool settings or Object Settings for text items.
            </div>
        </div>
    )
};
