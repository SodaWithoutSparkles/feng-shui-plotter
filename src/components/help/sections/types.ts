import type { ReactNode } from 'react';

export type HelpSectionId =
    | 'tools'
    | 'colors'
    | 'panel'
    | 'bottomBar'
    | 'fengshui'
    | 'compass'
    | 'images';

export interface HelpSection {
    id: HelpSectionId;
    title: string;
    content: ReactNode;
}
