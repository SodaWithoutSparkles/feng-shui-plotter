import React from 'react';

interface TextEditorOverlayProps {
    editingText: {
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
        rotation: number;
        fontSize: number;
        fontFamily: string;
        fill: string;
        stroke: string;
    };
    stageScale: number;
    fontStyle: string;
    fontWeight: string;
    onTextChange: (text: string) => void;
    onComplete: () => void;
}

export const TextEditorOverlay: React.FC<TextEditorOverlayProps> = ({
    editingText,
    stageScale,
    fontStyle,
    fontWeight,
    onTextChange,
    onComplete
}) => {
    return (
        <textarea
            value={editingText.text}
            onChange={(e) => onTextChange(e.target.value)}
            onBlur={onComplete}
            autoFocus
            placeholder="Type..."
            style={{
                position: 'absolute',
                left: editingText.x,
                top: editingText.y,
                width: `${Math.abs(editingText.width * stageScale)}px`,
                height: `${Math.abs(editingText.height * stageScale)}px`,
                fontSize: `${editingText.fontSize * stageScale}px`,
                fontFamily: editingText.fontFamily,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
                lineHeight: 1.2,
                color: editingText.stroke,
                backgroundColor: editingText.fill === 'transparent' ? 'transparent' : editingText.fill,
                border: 'none',
                outline: '2px solid blue',
                padding: '5px',
                zIndex: 1000,
                resize: 'none',
                overflow: 'hidden',
                transform: `rotate(${editingText.rotation}deg)`,
                transformOrigin: 'top left',
                textAlign: 'left',
                verticalAlign: 'middle',
                display: 'flex',
                alignItems: 'center'
            }}
        />
    );
};
