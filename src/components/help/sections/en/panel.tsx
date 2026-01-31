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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Panel Switching Logic</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Object Settings:</span> The panel automatically switches to this mode when one or more objects are selected, allowing you to adjust properties like color, size, and rotation.</li>
                    <li><span className="text-gray-100 font-semibold">History & Fly Star:</span> When no objects are selected, the panel toggles between "History" and "Fly Star Settings".
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>Click the toggle button (double arrow icon) on the right side of the header to manually switch between these views.</li>
                            <li>When Fly Star display is enabled, it defaults to the Fly Star settings panel.</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">What each view does</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Object Settings:</span> Edit size, position, rotation, opacity, and colors for selected items (multi-select supported).</li>
                    <li><span className="text-gray-100 font-semibold">History:</span> Displays recent actions; undone steps appear struck-through.</li>
                    <li><span className="text-gray-100 font-semibold">Fly Star:</span> Shows the chart and the year selector. It auto-adjusts based on the current year, and you can preview other years using the + - buttons.</li>
                </ul>
                <p className="text-gray-400">
                    For Fly Star details, see the FengShui help section.
                </p>
            </div>
        </div>
    )
};
