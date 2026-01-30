import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { X } from 'lucide-react';
import { getHelpSections, type HelpSection, type HelpSectionId } from './sections';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSectionId?: HelpSectionId;
    locale?: import('./sections').HelpLocale; // e.g. 'en', future: 'es', 'fr', etc.
}

export const HelpModal: FC<HelpModalProps> = ({
    isOpen,
    onClose,
    initialSectionId,
    locale
}) => {
    const helpSections = useMemo(() => getHelpSections(locale), [locale]);
    const defaultSectionId = helpSections[0]?.id ?? 'tools';
    const [activeSectionId, setActiveSectionId] = useState<HelpSectionId>(
        initialSectionId ?? defaultSectionId
    );

    useEffect(() => {
        if (!isOpen) return;
        setActiveSectionId(initialSectionId ?? defaultSectionId);
    }, [defaultSectionId, initialSectionId, isOpen]);

    const activeSection = useMemo(() => {
        return helpSections.find((section: HelpSection) => section.id === activeSectionId) ?? helpSections[0];
    }, [activeSectionId, helpSections]);

    if (!isOpen || !activeSection) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex border border-gray-700">
                <div className="w-56 border-r border-gray-700 bg-gray-950/40 p-4 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-gray-500 px-2">Help</div>
                    {helpSections.map((section: HelpSection) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSectionId(section.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                section.id === activeSectionId
                                    ? 'bg-blue-600/20 text-blue-200'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">Help</div>
                            <h2 className="text-lg font-semibold text-gray-100">{activeSection.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Close help"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeSection.content}
                    </div>
                </div>
            </div>
        </div>
    );
};
