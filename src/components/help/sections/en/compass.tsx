import type { HelpSection } from '../types';

export const compassHelpSection: HelpSection = {
    id: 'compass',
    title: 'Compass',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The compass has multiple modes and can be positioned and rotated over the floorplan.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Modes</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">View:</span> Displays the compass without interaction.</li>
                    <li><span className="text-gray-100 font-semibold">Edit (Interactive):</span> Shows handles so you can move, resize, and rotate the compass.</li>
                    <li><span className="text-gray-100 font-semibold">Projection:</span> Shows projection lines for the 24 mountain bearings.</li>
                    <li><span className="text-gray-100 font-semibold">Hidden:</span> Hides the compass.</li>
                </ul>
                <p className="text-gray-400">
                    Use the compass button in the bottom bar to cycle through these modes.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Opacity and radius</h4>
                <p className="text-gray-300">
                    Opacity and radius sliders are available under Header → Options. They only affect the compass.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Centering procedure</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                    <li>Draw rectangles that bound the house.</li>
                    <li>Draw diagonal lines to find the center.</li>
                    <li>Delete the rectangle, keeping only the diagonal lines.</li>
                    <li>Switch the compass to Edit mode and center it on the diagonal intersection.</li>
                    <li>Rotate the compass to match the building orientation.</li>
                    <li>Delete the diagonal lines and return the compass to View mode.</li>
                </ol>
            </div>
        </div>
    )
};
