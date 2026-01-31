import type { HelpSection, HelpSectionId } from './types';

// English
import { toolsHelpSection } from './en/tools';
import { colorsHelpSection } from './en/colors';
import { panelHelpSection } from './en/panel';
import { bottomBarHelpSection } from './en/bottomBar';
import { fengShuiHelpSection } from './en/fengshui';
import { compassHelpSection } from './en/compass';
import { imagesHelpSection } from './en/images';
import { headerHelpSection } from './en/header';
import { saveExportHelpSection } from './en/saveExport';
import { objectsHelpSection } from './en/objects';

// Simplified Chinese
import { toolsHelpSection as toolsHelpSectionZhHans } from './zh-hans/tools';
import { colorsHelpSection as colorsHelpSectionZhHans } from './zh-hans/colors';
import { panelHelpSection as panelHelpSectionZhHans } from './zh-hans/panel';
import { bottomBarHelpSection as bottomBarHelpSectionZhHans } from './zh-hans/bottomBar';
import { fengShuiHelpSection as fengShuiHelpSectionZhHans } from './zh-hans/fengshui';
import { compassHelpSection as compassHelpSectionZhHans } from './zh-hans/compass';
import { imagesHelpSection as imagesHelpSectionZhHans } from './zh-hans/images';
import { headerHelpSection as headerHelpSectionZhHans } from './zh-hans/header';
import { saveExportHelpSection as saveExportHelpSectionZhHans } from './zh-hans/saveExport';
import { objectsHelpSection as objectsHelpSectionZhHans } from './zh-hans/objects';

// Traditional Chinese
import { toolsHelpSection as toolsHelpSectionZhHant } from './zh-hant/tools';
import { colorsHelpSection as colorsHelpSectionZhHant } from './zh-hant/colors';
import { panelHelpSection as panelHelpSectionZhHant } from './zh-hant/panel';
import { bottomBarHelpSection as bottomBarHelpSectionZhHant } from './zh-hant/bottomBar';
import { fengShuiHelpSection as fengShuiHelpSectionZhHant } from './zh-hant/fengshui';
import { compassHelpSection as compassHelpSectionZhHant } from './zh-hant/compass';
import { imagesHelpSection as imagesHelpSectionZhHant } from './zh-hant/images';
import { headerHelpSection as headerHelpSectionZhHant } from './zh-hant/header';
import { saveExportHelpSection as saveExportHelpSectionZhHant } from './zh-hant/saveExport';
import { objectsHelpSection as objectsHelpSectionZhHant } from './zh-hant/objects';

export type { HelpSection, HelpSectionId };

export const availableHelpLocales = ['en', 'zh-hans', 'zh-hant'] as const;
export type HelpLocale = (typeof availableHelpLocales)[number];

// Returns help sections for a given locale. Extend switch when new locales are added.
export function getHelpSections(locale: HelpLocale = 'en'): HelpSection[] {
    switch (locale) {
        case 'zh-hans':
            return [
                headerHelpSectionZhHans,
                saveExportHelpSectionZhHans,
                toolsHelpSectionZhHans,
                objectsHelpSectionZhHans,
                colorsHelpSectionZhHans,
                panelHelpSectionZhHans,
                bottomBarHelpSectionZhHans,
                fengShuiHelpSectionZhHans,
                compassHelpSectionZhHans,
                imagesHelpSectionZhHans
            ];

        case 'zh-hant':
            return [
                headerHelpSectionZhHant,
                saveExportHelpSectionZhHant,
                toolsHelpSectionZhHant,
                objectsHelpSectionZhHant,
                colorsHelpSectionZhHant,
                panelHelpSectionZhHant,
                bottomBarHelpSectionZhHant,
                fengShuiHelpSectionZhHant,
                compassHelpSectionZhHant,
                imagesHelpSectionZhHant
            ];

        case 'en':
        default:
            return [
                headerHelpSection,
                saveExportHelpSection,
                toolsHelpSection,
                objectsHelpSection,
                colorsHelpSection,
                panelHelpSection,
                bottomBarHelpSection,
                fengShuiHelpSection,
                compassHelpSection,
                imagesHelpSection
            ];
    }
}

export const helpSections: HelpSection[] = getHelpSections();
