import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { X } from 'lucide-react';
import { getHelpSections, availableHelpLocales, type HelpSection, type HelpSectionId, type HelpLocale } from './sections';

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
    // Persisted key for the selected help locale
    const HELP_LOCALE_KEY = 'help.locale';

    const [selectedLocale, setSelectedLocale] = useState<HelpLocale>('en');

    // Labels for UI — extend as locales are added
    const LOCALE_LABELS: Record<string, string> = {
        en: 'English',
        'zh-hans': '中文（简体）',
        'zh-hant': '中文（繁體）'
    };

    // Load persisted locale when modal opens (or use prop or default)
    useEffect(() => {
        if (!isOpen) return;
        const stored = localStorage.getItem(HELP_LOCALE_KEY);
        const initial = stored && (availableHelpLocales as readonly string[]).includes(stored)
            ? (stored as HelpLocale)
            : (locale && (availableHelpLocales as readonly string[]).includes(locale)
                ? (locale as HelpLocale)
                : 'en');
        setSelectedLocale(initial);
    }, [isOpen, locale]);

    // Persist selection
    useEffect(() => {
        try {
            localStorage.setItem(HELP_LOCALE_KEY, selectedLocale);
        } catch { }
    }, [selectedLocale]);

    // Derive sections from selected locale
    const helpSections = useMemo(() => getHelpSections(selectedLocale), [selectedLocale]);

    // When modal opens or locale changes, reset active section to initial or default
    useEffect(() => {
        if (!isOpen) return;
        setActiveSectionId(initialSectionId ?? (helpSections[0]?.id ?? 'tools'));
    }, [isOpen, initialSectionId, selectedLocale]);

    const [activeSectionId, setActiveSectionId] = useState<HelpSectionId>(
        initialSectionId ?? (helpSections[0]?.id ?? 'tools')
    );

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
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${section.id === activeSectionId
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
                        <div className="flex items-center gap-3">
                            <label htmlFor="help-locale-select" className="sr-only">Language</label>
                            <select
                                id="help-locale-select"
                                value={selectedLocale}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if ((availableHelpLocales as readonly string[]).includes(v)) {
                                        setSelectedLocale(v as HelpLocale);
                                    }
                                }}
                                className="bg-gray-800 text-gray-200 text-sm rounded px-2 py-1 border border-gray-700"
                                aria-label="Select help language"
                            >
                                {availableHelpLocales.map((l) => (
                                    <option key={l} value={l}>{LOCALE_LABELS[l] ?? l}</option>
                                ))}
                            </select>

                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Close help"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeSection.content}
                    </div>
                </div>
            </div>
        </div>
    );
};
