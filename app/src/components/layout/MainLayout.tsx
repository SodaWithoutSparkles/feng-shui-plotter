import React from 'react';
import { useStore } from '../../store/useStore';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { BottomBar } from './BottomBar';
import { FloorplanCanvas } from '../canvas/FloorplanCanvas';
import { KeyboardShortcuts } from '../common/KeyboardShortcuts';
import { ProjectConfigModal } from '../ProjectConfigModal';

export const MainLayout: React.FC = () => {
    const showProjectConfig = useStore(state => state.showProjectConfig);
    const setShowProjectConfig = useStore(state => state.setShowProjectConfig);
    const setFloorplanImage = useStore(state => state.setFloorplanImage);
    const updateFloorplan = useStore(state => state.updateFloorplan);
    const updateFengShui = useStore(state => state.updateFengShui);

    // Read current state for pre-population
    const floorplan = useStore(state => state.floorplan);
    const fengShui = useStore(state => state.fengShui);

    const handleConfigComplete = (config: any) => {
        if (config.floorplanImage) {
            setFloorplanImage(config.floorplanImage);
        }
        updateFloorplan({ rotation: config.rotation });
        updateFengShui(config.fengShui);
        setShowProjectConfig(false);
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-900">
            <KeyboardShortcuts />
            <ProjectConfigModal
                isOpen={showProjectConfig}
                onClose={() => setShowProjectConfig(false)}
                onComplete={handleConfigComplete}
                initialData={{
                    floorplanImage: floorplan.imageSrc || '', // Handle null
                    rotation: floorplan.rotation,
                    fengShui
                }}
            />
            {/* 1. Top Header */}
            <Header />

            {/* 2. Middle Section (Tools + Canvas + Panels) */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Left Toolbar */}
                <LeftSidebar />

                {/* Center Canvas Area */}
                <div className="flex-1 bg-gray-500 relative overflow-hidden flex flex-col">
                    <div className="flex-1 relative bg-gray-200">
                        <FloorplanCanvas />
                    </div>
                </div>

                {/* Right Panels */}
                <RightSidebar />
            </div>

            {/* 3. Bottom Status Bar */}
            <BottomBar />
        </div>
    );
};
