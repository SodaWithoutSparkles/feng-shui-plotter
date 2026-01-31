import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: 'FengShui',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                This software features a built-in FengShui calculation engine that automatically generates the Fly Star chart. Relevant controls are located in Project Settings (File → Configure Project) and the right-side Fly Star panel.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Basic Parameter Settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">House Completed:</span> Input the completion year of the building; the system will suggest the corresponding Yun (Period).</li>
                    <li><span className="text-gray-100 font-semibold">Yun/Period:</span> Select Period 1-9 (e.g., Period 9 after 2024). This determines the distribution of the base/period stars.</li>
                    <li><span className="text-gray-100 font-semibold">Facing Direction:</span> Use the slider to set a precise angle. The system supports 24 Mountains and automatically detects:
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li><span className="text-gray-200">Main</span> (Main direction)</li>
                            <li><span className="text-gray-200">Replacement/Sub</span> (Replacement Star): When the angle is close to the boundary between two mountains, the system automatically applies the Replacement chart.</li>
                        </ul>
                    </li>
                    <li><span className="text-gray-100 font-semibold">Annual Star:</span> Set the current year to calculate the changing position of the purple annual stars.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fly Star Color and Position Reference</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">Blue:</span> Water Star (Xiang Xing), located at the top-left of each cell.</li>
                    <li><span className="text-gray-200 font-semibold">Black:</span> Period Star (Base), located at the bottom-left (Chinese numerals) of each cell.</li>
                    <li><span className="text-red-300 font-semibold">Red:</span> Mountain Star (Sitting Star), located at the top-right of each cell.</li>
                    <li><span className="text-purple-300 font-semibold">Purple:</span> Annual Star, located at the bottom-right of each cell.</li>
                </ul>
            </div>

            <p className="text-gray-400 border-t border-gray-700 pt-2 mt-2">
                The chart updates instantly when parameters change. To hide the chart, use the sidebar toggle or "Show Fly Star" in the top menu.
            </p>
            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">Note:</strong> FengShui is a complex and subjective field.
                Calculations provided by this software are for reference only and do not guarantee any effects.
                Please evaluate carefully in practical applications. The developer is not responsible for any outcomes resulting from the use of this software.
                For detailed interpretations of star combinations, meanings, and layout suggestions, please consult relevant books or a professional FengShui master.
            </div>
        </div>
    )
};
