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

    // Persisted value can be an explicit locale or 'auto' to mean "follow browser"
    type PersistedHelpLocale = HelpLocale | 'auto';

    const detectBrowserLocale = (): HelpLocale => {
        try {
            const nav = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
            const l = nav.toLowerCase();
            if (l.startsWith('zh')) {
                // prefer traditional for Taiwan/HK/Macau or explicit Hant variant
                if (l.includes('-tw') || l.includes('-hk') || l.includes('-mo') || l.includes('hant')) {
                    return 'zh-hant';
                }
                return 'zh-hans';
            }
            // default to English
            return 'en';
        } catch { return 'en'; }
    };

    const getInitialPersistedLocale = (propLocale?: HelpLocale): PersistedHelpLocale => {
        try {
            const stored = localStorage.getItem(HELP_LOCALE_KEY);
            if (stored === 'auto') return 'auto';
            if (stored && (availableHelpLocales as readonly string[]).includes(stored)) return stored as HelpLocale;
        } catch { }
        if (propLocale && (availableHelpLocales as readonly string[]).includes(propLocale)) return propLocale;
        return 'auto';
    };

    const initialPersisted = getInitialPersistedLocale(locale);
    const [persistedLocale, setPersistedLocale] = useState<PersistedHelpLocale>(initialPersisted);
    const [selectedLocale, setSelectedLocale] = useState<HelpLocale>(() =>
        initialPersisted === 'auto' ? detectBrowserLocale() : initialPersisted
    );

    // Labels for UI — extend as locales are added
    const LOCALE_LABELS: Record<string, string> = {
        'auto': 'Automatic (browser)',
        'en': 'English',
        'zh-hans': '中文（简体）',
        'zh-hant': '中文（繁體）'
    };

    // Load persisted mode when modal opens (or use prop). Only run on open/prop change to avoid interfering with user interactions.
    useEffect(() => {
        if (!isOpen) return;
        try {
            const stored = localStorage.getItem(HELP_LOCALE_KEY);
            const resolved: PersistedHelpLocale = stored === 'auto'
                ? 'auto'
                : (stored && (availableHelpLocales as readonly string[]).includes(stored) ? (stored as HelpLocale)
                    : (locale && (availableHelpLocales as readonly string[]).includes(locale) ? (locale as HelpLocale) : 'auto'));
            if (resolved !== persistedLocale) {
                setPersistedLocale(resolved);
                setSelectedLocale(resolved === 'auto' ? detectBrowserLocale() : resolved);
            }
        } catch { }
    }, [isOpen, locale]);

    // Persist selection mode (auto or explicit)
    useEffect(() => {
        try {
            localStorage.setItem(HELP_LOCALE_KEY, persistedLocale);
        } catch { }
    }, [persistedLocale]);

    // react to storage changes in other tabs
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== HELP_LOCALE_KEY) return;
            try {
                const v = e.newValue;
                const resolved: PersistedHelpLocale = v === 'auto'
                    ? 'auto'
                    : (v && (availableHelpLocales as readonly string[]).includes(v) ? (v as HelpLocale) : 'auto');
                setPersistedLocale(resolved);
                setSelectedLocale(resolved === 'auto' ? detectBrowserLocale() : resolved);
            } catch { }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Derive sections from selected locale
    const helpSections = useMemo(() => getHelpSections(selectedLocale), [selectedLocale]);

    useEffect(() => {
        if (!isOpen) return;
        const onNavigate = (event: Event) => {
            const detail = (event as CustomEvent<HelpSectionId | undefined>).detail;
            if (!detail) return;
            if (!helpSections.some((section) => section.id === detail)) return;
            setActiveSectionId(detail);
        };

        document.addEventListener('help-navigate', onNavigate as EventListener);
        return () => document.removeEventListener('help-navigate', onNavigate as EventListener);
    }, [isOpen, helpSections]);

    // When modal opens or the set of sections changes, reset active section to initial or default
    useEffect(() => {
        if (!isOpen) return;
        setActiveSectionId(initialSectionId ?? (helpSections[0]?.id ?? 'tools'));
    }, [isOpen, initialSectionId, helpSections]);

    const [activeSectionId, setActiveSectionId] = useState<HelpSectionId>(() => {
        const resolvedLocale = initialPersisted === 'auto' ? detectBrowserLocale() : initialPersisted;
        const initialSections = getHelpSections(resolvedLocale);
        return initialSectionId ?? (initialSections[0]?.id ?? 'tools');
    });

    const activeSection = useMemo(() => {
        return helpSections.find((section: HelpSection) => section.id === activeSectionId) ?? helpSections[0];
    }, [activeSectionId, helpSections]);

    if (!isOpen || !activeSection) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex border border-gray-700">
                <div className="w-56 border-r border-gray-700 bg-gray-950/40 p-4 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-gray-500 px-2">Help</div>
                    {helpSections.map((section: HelpSection) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSectionId(section.id)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors m-0 ${section.id === activeSectionId
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
                                value={persistedLocale}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === 'auto') {
                                        setPersistedLocale('auto');
                                        setSelectedLocale(detectBrowserLocale());
                                    } else if ((availableHelpLocales as readonly string[]).includes(v)) {
                                        setPersistedLocale(v as PersistedHelpLocale);
                                        setSelectedLocale(v as HelpLocale);
                                    }
                                }}
                                className="bg-gray-800 text-gray-200 text-sm rounded px-2 py-1 border border-gray-700"
                                aria-label="Select help language"
                            >
                                <option value="auto">{LOCALE_LABELS['auto']}</option>
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
