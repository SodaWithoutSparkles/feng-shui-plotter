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
                    <li><span className="text-gray-100 font-semibold">Object Settings:</span> The panel automatically switches to this mode when one or more objects are selected, allowing you to adjust properties like color, size, and rotation. See <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'objects' }))}>Object Operations</span> for details.</li>
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
                    <li>
                        <span className="text-gray-100 font-semibold">Fly Star:</span>
                        Shows the chart and the year selector. It also indicates which school is used to determine replacement directions (displayed as “沈氏” or “中州”).
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>
                                <span className="font-semibold">Year control:</span> Displays the current chart year and provides a slider with presets (e.g., <span className="text-gray-200">Now</span>, <span className="text-gray-200">Next</span>) for quick selection.
                            </li>
                            <li>
                                <span className="font-semibold">Calendar (Auto):</span> When you see the calendar icon the Fly Star is in <em>Auto-Sync</em> mode and follows the real current year. Clicking the calendar will "Lock to Current Year" which switches the panel to a manual (locked) year.
                            </li>
                            <li>
                                <span className="font-semibold">Lock (Manual):</span> When the lock icon is shown the chart is fixed to a specific year you chose. Click the lock to "Switch to Auto-Sync" to resume following the current year. Manual mode is useful to inspect historical or future years without the chart updating automatically.
                            </li>
                        </ul>
                        <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'fengshui' }))}> See FengShui help section</span>.
                    </li>
                </ul>
                <p className="text-gray-400">
                    For Fly Star details, see the FengShui help section.
                </p>
            </div>
        </div>
    )
};
