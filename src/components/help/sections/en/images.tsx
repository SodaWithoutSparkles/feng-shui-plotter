import type { HelpSection } from '../types';

export const imagesHelpSection: HelpSection = {
    id: 'images',
    title: 'Images',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                You can insert images directly onto the canvas to trace or annotate them.
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Insert via Header → Edit</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Insert Local Image:</span> Choose an image file from your computer.</li>
                    <li><span className="text-gray-100 font-semibold">Insert Remote Image:</span> Paste an image URL to place it on the canvas.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paste from clipboard</h4>
                <p className="text-gray-300">
                    You can paste images directly from your clipboard, or paste an image URL. The image is inserted at
                    the canvas center.
                </p>
            </div>
        </div>
    )
};
