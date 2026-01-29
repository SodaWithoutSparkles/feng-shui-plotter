import React from 'react';

interface CompassOverlayProps {
    rotation: number;
}

export const CompassOverlay: React.FC<CompassOverlayProps> = ({ rotation }) => {
    return (
        <div
            className="w-64 h-64 bg-white/80 rounded-full shadow-lg border-4 border-gray-800 flex items-center justify-center relative backdrop-blur-sm"
            style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease-out' }}
        >
            {/* Simple CSS/SVG Compass Representation */}
            {/* Outer Ring */}
            <div className="absolute inset-2 border-2 border-dashed border-gray-400 rounded-full"></div>

            {/* Cardinal Directions */}
            <div className="absolute top-4 font-bold text-xl text-red-600">N</div>
            <div className="absolute bottom-4 font-bold text-xl text-gray-800">S</div>
            <div className="absolute left-4 font-bold text-xl text-gray-800">W</div>
            <div className="absolute right-4 font-bold text-xl text-gray-800">E</div>

            {/* Center Cross */}
            <div className="w-full h-px bg-gray-300 absolute"></div>
            <div className="h-full w-px bg-gray-300 absolute"></div>

            {/* Needle (if we want one fixed relative to overlay, or maybe the whole overlay rotates?) 
                Constraint: "toggle overlay of the compass. All move/resize operation... relative to the center of the compass."
                If "rotation" prop dictates the compass orientation (0-365), then N should be at that angle.
            */}
        </div>
    );
};
