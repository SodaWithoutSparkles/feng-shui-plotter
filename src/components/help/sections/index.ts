import type { HelpSection, HelpSectionId } from './types';
import { toolsHelpSection } from './en/tools';
import { colorsHelpSection } from './en/colors';
import { panelHelpSection } from './en/panel';
import { fengShuiHelpSection } from './en/fengshui';
import { compassHelpSection } from './en/compass';
import { imagesHelpSection } from './en/images';

export type { HelpSection, HelpSectionId };

export const availableHelpLocales = ['en'] as const;
export type HelpLocale = (typeof availableHelpLocales)[number];

// Returns help sections for a given locale. Extend switch when new locales are added.
export function getHelpSections(locale: HelpLocale = 'en'): HelpSection[] {
    switch (locale) {
        case 'en':
        default:
            return [
                toolsHelpSection,
                colorsHelpSection,
                panelHelpSection,
                fengShuiHelpSection,
                compassHelpSection,
                imagesHelpSection
            ];
    }
}

export const helpSections: HelpSection[] = getHelpSections();
