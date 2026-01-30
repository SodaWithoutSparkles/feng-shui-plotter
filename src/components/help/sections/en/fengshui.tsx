import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: 'FengShui',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                Feng Shui settings power the Fly Star chart. The controls are available in the project configuration
                (File → Configure Project) and in the Fly Star panel.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Available settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Year:</span> The year that the purple starting number was calculated.</li>
                    <li><span className="text-gray-100 font-semibold">Blacks:</span> Starting number.</li>
                    <li><span className="text-gray-100 font-semibold">Reds:</span> Starting number with optional reversed direction.</li>
                    <li><span className="text-gray-100 font-semibold">Blues:</span> Starting number with optional reversed direction.</li>
                    <li><span className="text-gray-100 font-semibold">Purples:</span> Starting number.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fly Star color references</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">Blue:</span> Top-left numbers in each cell.</li>
                    <li><span className="text-red-300 font-semibold">Red:</span> Top-right numbers in each cell.</li>
                    <li><span className="text-gray-200 font-semibold">Black:</span> Bottom-left (Chinese numeral) in each cell.</li>
                    <li><span className="text-purple-300 font-semibold">Purple:</span> Bottom-right numbers in each cell.</li>
                </ul>
                <p className="text-gray-400">
                    This section describes what the settings are. If You need help deriving these numbers, please consult a Feng Shui master.
                </p>
            </div>
        </div>
    )
};
