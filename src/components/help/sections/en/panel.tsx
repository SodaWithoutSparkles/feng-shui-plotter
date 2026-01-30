import type { HelpSection } from '../types';

export const panelHelpSection: HelpSection = {
    id: 'panel',
    title: 'Multi-function panel',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                The top panel of the right sidebar automatically switches between History, Fly Star, and Object Settings.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">When it changes</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Object Settings:</span> Shown whenever one or more objects are selected.</li>
                    <li><span className="text-gray-100 font-semibold">Fly Star Settings:</span> Shown when no selection exists and Fly Star is toggled on.</li>
                    <li><span className="text-gray-100 font-semibold">History:</span> Default view when nothing is selected and Fly Star is off.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">What each view does</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Object Settings:</span> Edit size, position, rotation, opacity, and colors for selected items (multi-select supported).</li>
                    <li><span className="text-gray-100 font-semibold">History:</span> Displays recent actions; undone steps appear struck-through.</li>
                    <li><span className="text-gray-100 font-semibold">Fly Star:</span> Shows the chart and the year selector. It defaults to the current year and adjusts automatically via the year offset setting.</li>
                </ul>
                <p className="text-gray-400">
                    For Fly Star details, see the FengShui help section.
                </p>
            </div>
        </div>
    )
};
