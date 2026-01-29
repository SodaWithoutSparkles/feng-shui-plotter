export interface Point {
    x: number;
    y: number;
}

export type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'star' | 'arrow' | 'polygon' | 'text' | 'image';

export interface BaseShape {
    id: string;
    type: ShapeType;
    x: number; // Top-left x coordinate
    y: number; // Top-left y coordinate
    rotation: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
    opacity: number;
    draggable: boolean;
    children?: CanvasItem[];
}

export interface RectangleShape extends BaseShape {
    type: 'rectangle';
    width: number;
    height: number;
}

export interface EllipseShape extends BaseShape {
    type: 'ellipse';
    radiusX: number;
    radiusY: number;
}

export interface PolygonShape extends BaseShape {
    type: 'polygon';
    points: Point[];
}

export interface LineShape extends BaseShape {
    type: 'line';
    points: Point[];
    closed: boolean;
}

export interface TextShape extends BaseShape {
    type: 'text';
    text: string;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold';
    align: 'left' | 'center' | 'right';
}

export interface ImageShape extends BaseShape {
    type: 'image';
    src: string; // Base64 or URL
    width: number;
    height: number;
}

export interface ArrowShape extends BaseShape {
    type: 'arrow';
    points: Point[]; // >=2 points, if more than 2, draws a polyline
    pointerLength: number;
    pointerWidth: number;
}

export interface StarShape extends BaseShape {
    type: 'star';
    numPoints: number;
    innerRadius: number;
    outerRadius: number;
}

// Union type for all shapes
export type CanvasItem = RectangleShape | EllipseShape | LineShape | TextShape | ImageShape | ArrowShape | StarShape | PolygonShape;

// Feng Shui Data Interface
export interface FengShuiData {
    blacks: {
        start: number;
    };
    reds: {
        start: number;
        reversed: boolean;
    };
    blues: {
        start: number;
        reversed: boolean;
    };
    purples: {
        start: number;
        calculated_at: Date;
        offset?: number;
    };
}

export interface FlyStarData {
    blacks: Number[];
    reds: Number[];
    blues: Number[];
    purples: Number[];
}

// The Project Save File Format
export interface SaveFile {
    version: string;
    floorplan: {
        imageSrc: string | null;
        rotation: number;
        scale: number;
        opacity: number;
        x: number;
        y: number;
    };
    objects: CanvasItem[];
    fengShui: FengShuiData;
    compass: {
        visible: boolean; // Deprecated, use mode
        mode: 'hidden' | 'visible' | 'interactive' | 'projections';
        rotation: number;
        opacity: number;
        x: number;
        y: number;
        radius: number;
        locked: boolean;
    };
    timestamp?: Date | string;
}

export const CURRENT_VERSION = '1.0.0';
