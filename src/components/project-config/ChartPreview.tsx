import React from 'react';
import type { FengShuiData } from '../../types';
import { FlystarVisualization } from '../FlystarVisualization';

interface ChartPreviewProps {
    fengShui: FengShuiData;
    onUpdateFengShui: (updates: Partial<FengShuiData>) => void;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({
    fengShui,
    onUpdateFengShui
}) => {
    return (
        <div className="p-0 flex justify-center bg-gray-900 flex-1 overflow-auto">
            <FlystarVisualization
                fengShui={fengShui}
                updateFengShui={onUpdateFengShui}
                showControls={true}
                showFullSettings={true}
            />
        </div>
    );
};
