import type { HelpSection } from '../types';

export const saveExportHelpSection: HelpSection = {
    id: 'saveExport',
    title: 'Save & Export',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                This app supports multiple ways to save your work.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Save Project</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">In-place Save:</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>Supported on Chrome/Edge Desktop (requires file access).</li>
                            <li>Writes changes directly to the original file.</li>
                            <li>
                                <span className="text-yellow-400 text-opacity-90">Warning:</span> Saving after clearing the canvas will result in an empty file.
                            </li>
                            <li>Falls back to downloading a new <code>.fsp</code> file if not supported/authorized.</li>
                        </ul>
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">Download:</span>
                        Downloads a new <code>.fsp</code> file if In-place Save is unavailable.
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Save As</h4>
                <p className="text-gray-300">
                    "Save As" always opens a dialog to name and download a new project file, regardless of current state.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Auto-save</h4>
                <p className="text-gray-300">
                    When enabled, backups are saved to browser LocalStorage. It attempts to restore the state if the page crashes or is refreshed.
                    <br />
                    <span className="text-yellow-400 text-xs text-opacity-80">Note: Clearing browser cache will lose auto-saves. Always manually save important projects.</span>
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Export Image</h4>
                <p className="text-gray-300">
                    Exports current canvas (floorplan, objects, compass) as a single image.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">Options:</span> Choose format (PNG/JPEG) and resolution (1x, 2x, 4x) in the dialog.
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">Flying Star Chart:</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>The chart supports 25 positioning modes.</li>
                            <li>To <strong>exclude</strong> the chart from export, select mode <strong>[22]</strong> (center).</li>
                            <li>Other modes place it in specific locations on the image.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
};
