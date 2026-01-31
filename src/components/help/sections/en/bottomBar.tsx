import type { HelpSection } from '../types';

export const bottomBarHelpSection: HelpSection = {
    id: 'bottomBar',
    title: 'Bottom Bar',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The bottom bar provides useful status information and quick actions.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Features</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Status Info:</span> Displays current cursor coordinates (X, Y), canvas zoom level, and auto-save status.</li>
                    <li><span className="text-gray-100 font-semibold">Home:</span> Click the Home button to reset the view and center the floor plan.</li>
                    <li><span className="text-gray-100 font-semibold">Compass Toggle:</span> Quickly switch compass display modes (Hidden, View, Edit, Extension Lines).</li>
                </ul>
            </div>
        </div>
    )
};
