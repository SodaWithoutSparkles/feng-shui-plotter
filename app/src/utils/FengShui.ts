import type { FengShuiData, FlyStarData } from '../types';

const FLY_STAR = [  // Flying Star sequence for Feng Shui
    4, 9, 2,
    3, 5, 7,
    8, 1, 6
];
const REV_FLY_STAR = [  // Reverse Flying Star sequence for Feng Shui
    2, 6, 4,
    3, 1, 8,
    7, 5, 9
];

export const DIGIT_TO_CHINESE = [
    '零', '一', '二', '三', '四', '五', '六', '七', '八', '九'
];

export function genFengShui(
    blacksStart: number = 0,
    redsStart: number = 0,
    redsReversed: boolean = false,
    bluesStart: number = 0,
    bluesReversed: boolean = false,
    purplesStart: number = 0
): FengShuiData {
    return {
        blacks: {
            start: blacksStart
        },
        reds: {
            start: redsStart,
            reversed: redsReversed
        },
        blues: {
            start: bluesStart,
            reversed: bluesReversed
        },
        purples: {
            start: purplesStart,
            calculated_at: new Date
        }
    }
}

function genFlyStarSeq(
    start: number,
    reversed: boolean = false,
): Number[] {
    let out, offset;
    if (!reversed) {
        offset = FLY_STAR[4] - start;
        out = [...FLY_STAR];
    }
    offset = REV_FLY_STAR[4] - start;
    out = [...REV_FLY_STAR];
    for (let i = 0; i < out.length; i++) {
        out[i] = (out[i] - 1 + offset) % 9 + 1;
    }
    return out;
}

export function genFullFlyStarSeq(
    fengShuiData: FengShuiData,
    currYear: number
): FlyStarData {
    let offset = currYear - fengShuiData.purples.calculated_at.getFullYear();
    return {
        blacks: genFlyStarSeq(fengShuiData.blacks.start),
        reds: genFlyStarSeq(fengShuiData.reds.start, fengShuiData.reds.reversed),
        blues: genFlyStarSeq(fengShuiData.blues.start, fengShuiData.blues.reversed),
        purples: genFlyStarSeq(fengShuiData.purples.start + offset)
    }
}
