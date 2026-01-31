import React from 'react';
import type { HelpSectionId } from '../../help/sections';
import { MenuItem } from './MenuItem';

interface HelpMenuProps {
    activeMenu: string | null;
    onToggle: (menu: string) => void;
    onCloseMenu: () => void;
    onShowHelp: (sectionId: HelpSectionId) => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({
    activeMenu,
    onToggle,
    onCloseMenu,
    onShowHelp
}) => {
    return (
        <div className="relative">
            <div
                className={`px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center ${activeMenu === 'help' ? 'bg-gray-700' : ''}`}
                onClick={() => onToggle('help')}
            >
                Help
            </div>
            {activeMenu === 'help' && (
                <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-xl py-1 rounded-b-md min-w-[260px]">
                    <MenuItem label="Top Menu" onClick={() => { onShowHelp('header'); onCloseMenu(); }} />
                    <MenuItem label="Save & Export" onClick={() => { onShowHelp('saveExport'); onCloseMenu(); }} />
                    <MenuItem label="Tools" onClick={() => { onShowHelp('tools'); onCloseMenu(); }} />
                    <MenuItem label="Object Operations" onClick={() => { onShowHelp('objects'); onCloseMenu(); }} />
                    <MenuItem label="Colors" onClick={() => { onShowHelp('colors'); onCloseMenu(); }} />
                    <MenuItem label="Multi-function panel" onClick={() => { onShowHelp('panel'); onCloseMenu(); }} />
                    <MenuItem label="Bottom Bar" onClick={() => { onShowHelp('bottomBar'); onCloseMenu(); }} />
                    <MenuItem label="FengShui" onClick={() => { onShowHelp('fengshui'); onCloseMenu(); }} />
                    <MenuItem label="Compass" onClick={() => { onShowHelp('compass'); onCloseMenu(); }} />
                    <MenuItem label="Images" onClick={() => { onShowHelp('images'); onCloseMenu(); }} />
                </div>
            )}
        </div>
    );
};
