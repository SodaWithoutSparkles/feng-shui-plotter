import type { FengShuiData, FlyStarData, MountainFacingData, FengShuiMethod } from '../types';

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

export const MOUNTAINS_24 = [
    '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙',
    '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬'
];

export const DIGIT_TO_CHINESE = [
    '零', '一', '二', '三', '四', '五', '六', '七', '八', '九'
];
export function getPurpleStarFromYear(year: number): number {
    let star = (11 - (year % 9)) % 9;
    if (star === 0) star = 9;
    return star;
};
export function genFengShui(
    blacksStart: number = 0,
    redsStart: number = 0,
    redsReversed: boolean = false,
    bluesStart: number = 0,
    bluesReversed: boolean = false,
    purplesStart: number = 0,
    method: FengShuiMethod = 'shen_shi_45'
): FengShuiData {
    return {
        method,
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
            calculated_at: new Date,
            viewMode: 'auto'
        }
    }
}

function genFlyStarSeq(
    start: number,
    reversed: boolean = false,
): number[] {
    let out: number[], offset;
    let center;

    if (!reversed) {
        center = FLY_STAR[4];
        out = [...FLY_STAR];
    } else {
        center = REV_FLY_STAR[4];
        out = [...REV_FLY_STAR];
    }

    offset = start - center;

    for (let i = 0; i < out.length; i++) {
        // (x - 1 + offset) % 9 + 1, handling negative modulo
        let val = (out[i] - 1 + offset) % 9;
        if (val < 0) val += 9;
        out[i] = val + 1;
    }
    return out;
}

export function genFullFlyStarSeq(
    fengShuiData: FengShuiData,
    currYear: number
): FlyStarData {
    // Handle date string serialization issue
    const calcDate = fengShuiData.purples.calculated_at instanceof Date
        ? fengShuiData.purples.calculated_at
        : new Date(fengShuiData.purples.calculated_at);

    let offset = currYear - calcDate.getFullYear();
    if (isNaN(offset)) offset = 0; // Fallback
    // console.log('getting purple for year', fengShuiData.purples.start - offset)
    return {
        blacks: genFlyStarSeq(fengShuiData.blacks.start),
        reds: genFlyStarSeq(fengShuiData.reds.start, fengShuiData.reds.reversed),
        blues: genFlyStarSeq(fengShuiData.blues.start, fengShuiData.blues.reversed),
        purples: genFlyStarSeq(fengShuiData.purples.start - offset)
    }
}

export function normalizeAngle(
    angle: number
): number {
    // normalize any angle to [0, 360]
    if (angle >= 0) return angle % 360;
    return (angle + Math.ceil(Math.abs(angle) / 360) * 360) % 360

}

export function getPeriodFromYear(
    year: number
): number {
    // loop every 20 years
    // 0-th is [1864-1884), then +1 to get the first period
    // 8-th is [2024-2044), then +1 to get 9th period
    while (year < 64) year += 180;

    let offset = year - 64;
    return (Math.floor(offset / 20) % 9) + 1;
}

export function getYuanFromPeriod(
    period: number
): number {
    // ((( period -1 ) % 9 +1 -1) /3).floor
    return Math.floor(((period - 1) % 9) / 3);
}


export function getMountainIndex(angle: number): number {
    return Math.floor((normalizeAngle(angle) + 7.5) / 15) % 24;
}

interface YuanLongYinYang {
    long: 'sky' | 'earth' | 'human';
    yinYang: 'yin' | 'yang';
}

function getYuanLongFromMountainIndex(index: number): YuanLongYinYang {

    // 天元龍：乾坤艮巽（陽），子午卯酉（陰）；
    // 地元龍：甲庚壬丙（陽），辰戌丑未（陰）；
    // 人元龍：寅申巳亥（陽），癸丁乙辛（陰）。
    // export const MOUNTAINS_24 = [
    //     '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳', '丙',
    //     '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬'
    // ];
    const skys = [21, 15, 3, 9, 0, 12, 6, 18];
    const earths = [5, 17, 23, 11, 8, 20, 2, 14];
    const humans = [4, 16, 10, 22, 1, 13, 7, 19];
    let longIndex = 0;

    if (skys.includes(index)) {
        longIndex = skys.indexOf(index);
        return {
            long: 'sky',
            yinYang: (longIndex > 3) ? 'yin' : 'yang'
        };
    }
    if (earths.includes(index)) {
        longIndex = earths.indexOf(index);
        return {
            long: 'earth',
            yinYang: (longIndex > 3) ? 'yin' : 'yang'
        };
    }
    if (humans.includes(index)) {
        longIndex = humans.indexOf(index);
        return {
            long: 'human',
            yinYang: (longIndex > 3) ? 'yin' : 'yang'
        };
    }
    throw new Error(`Invalid mountain index: ${index}`);

}


function checkJian(angle: number, mainIndex: number, threshold: number = 3.0): number | null {
    // 24 mountains, each 15 degrees.
    // centered at 0, 15, 30, ..., 345
    // so it is center +-7.5 degrees
    // center +- 4.5 is considered main
    // center +- 7.5 is considered jian (sub)
    // if within jian range but outside main range, return jian index
    // otherwise return null
    // jian index is the closest mountain index apart from mainIndex
    // i.e. for main index 12, (坐子向午), jian indices are either 11 or 13
    // decide by which is closer to the angle
    // full example: 186 degrees -> main index 12, jian is 13 because 195 is closer to 186 than 165

    // Use shortest angular difference from the mountain center to handle wraparounds
    const norm = normalizeAngle(angle);
    const center = normalizeAngle(mainIndex * 15);

    let diff = norm - center;
    // shift to (-180, 180]
    if (diff > 180) diff -= 360;
    if (diff <= -180) diff += 360;

    const absDiff = Math.abs(diff);

    // within main facing range
    // Shen Shi Strict: Main is center +/- 3 degrees. Deviation > 3 triggers Jian.
    // Zhong Zhou / Other: Main is center +/- 4.5 degrees. Deviation > 4.5 triggers Jian.
    if (absDiff <= threshold) return null;

    // outside jian range
    if (absDiff > 7.5) return null;

    // within jian (sub) range: pick neighbor index toward the angle
    const dir = diff > 0 ? 1 : -1;
    const jianIndex = (mainIndex + dir + 24) % 24;
    return jianIndex;

}

function getSectorFromAngle(angle: number): number {
    // Map angle one of 8 sectors, expect normalized angle [0, 360)
    // Each sector is 45 degrees, centered at 0, 45, 90, ..., 315
    // So we offset by 22.5 degrees, then integer divide by 45
    // Finally mod 8 to wrap around
    // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7
    return Math.floor((normalizeAngle(angle) + 22.5) / 45) % 8;
}

const SECTOR_TO_FLYSTAR_INDEX = [
    { mountain: 1, water: 7 }, // N
    { mountain: 2, water: 6 }, // NE
    { mountain: 5, water: 3 }, // E
    { mountain: 8, water: 0 }, // SE
    { mountain: 7, water: 1 }, // S
    { mountain: 6, water: 2 }, // SW
    { mountain: 3, water: 5 }, // W
    { mountain: 0, water: 8 }  // NW
];

// 24 Mountains to Replacement Star (Ti Gua) Map
// 0:Zi->1, 1:Gui->1, 2:Chou->7, 3:Gen->7, 4:Yin->9, 5:Jia->1, ...
const REPLACEMENT_STARS = [
    1, 1, 7, 7, 9, 1, 2, 2, 6, 6, 6, 7,
    9, 9, 2, 2, 1, 9, 7, 7, 6, 6, 6, 2
];

// Zhong Zhou mapping (Geng/Yin -> 1)
const REPLACEMENT_STARS_ZZ = [
    1, 1, 7, 7, 1, 1, 2, 2, 6, 6, 6, 7,
    9, 9, 2, 2, 1, 1, 7, 7, 6, 6, 6, 2
];

// Mountain Index to Gua Index (0:Kan, 1:Gen, 2:Zhen, 3:Xun, 4:Li, 5:Kun, 6:Dui, 7:Qian)
const GUA_INDICES = [
    0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4,
    4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 0
];

// Star (1-9) to Gua Index (0-7). 5 is -1.
const STAR_TO_GUA = [-1, 0, 5, 2, 3, -1, 7, 6, 1, 4];

// Fly Star Sequence Index to Gua Index
// 0:SE(Xun), 1:S(Li), 2:SW(Kun), 3:E(Zhen), 4:C, 5:W(Dui), 6:NE(Gen), 7:N(Kan), 8:NW(Qian)
const LOC_INDEX_TO_GUA = [3, 4, 5, 2, -1, 6, 1, 0, 7];

// Gua Index to Mountains [Earth, Sky, Human]
const GUA_MOUNTAINS = [
    [23, 0, 1],   // Kan
    [2, 3, 4],    // Gen
    [5, 6, 7],    // Zhen
    [8, 9, 10],   // Xun
    [11, 12, 13], // Li
    [14, 15, 16], // Kun
    [17, 18, 19], // Dui
    [20, 21, 22]  // Qian
];

function getTrigramMountain(guaIndex: number, dragon: 'sky' | 'earth' | 'human'): number {
    const mountains = GUA_MOUNTAINS[guaIndex];
    if (dragon === 'earth') return mountains[0];
    if (dragon === 'sky') return mountains[1];
    return mountains[2]; // human
}




export function getMountainFacingFromAngle(
    facingAngle: number,
    period: number, // 元運
    method: FengShuiMethod = 'shen_shi_45'
): MountainFacingData {

    // Normalize angle to [0, 360)
    let angle = normalizeAngle(facingAngle);
    let mainIndex = getMountainIndex(angle);
    let sector = getSectorFromAngle(angle);
    let blackFlystars = genFlyStarSeq(period); // Period Chart (Yun Pan)

    // Get mountain and water star starting number first
    // These come from the Period Chart's stars at Mountain and Facing positions
    let mountainStarLoc = SECTOR_TO_FLYSTAR_INDEX[sector].mountain;
    let waterStarLoc = SECTOR_TO_FLYSTAR_INDEX[sector].water;

    let baseMountainStar = blackFlystars[mountainStarLoc];
    let baseWaterStar = blackFlystars[waterStarLoc];

    // Handle main (正向) and sub facing (兼向) (if any)
    let mainFacing = MOUNTAINS_24[mainIndex];
    let subFacing: string | null = null;

    // Determine Threshold
    // Shen Shi (Strict): 3.0 degrees
    // Zhong Zhou (Classic/Broad): 4.5 degrees (Implied by previous implementation)
    const threshold = (method.endsWith('3')) ? 3.0 : 4.5;
    const isShenShi = method.startsWith('shen_shi');

    // check for sub-facing (兼向)
    const jianIndex = checkJian(angle, mainIndex, threshold);

    let isReplacement = false;

    if (jianIndex !== null) {
        subFacing = MOUNTAINS_24[jianIndex];

        if (isShenShi) {
            // Shen Shi (Strict/Full): Always replace if Jian
            isReplacement = true;
        } else {
            // Zhong Zhou (Partial / Classic Text): Logic that was here previously
            // Rule 1: Out of Gua (Different Trigram) -> Replace
            if (GUA_INDICES[mainIndex] !== GUA_INDICES[jianIndex]) {
                isReplacement = true;
            } else {
                // Rule 2: Same Gua, Different Yin/Yang -> Replace
                // Get Yin/Yang of main and jian
                const mainYy = getYuanLongFromMountainIndex(mainIndex).yinYang;
                const jianYy = getYuanLongFromMountainIndex(jianIndex).yinYang;
                if (mainYy !== jianYy) {
                    isReplacement = true;
                }
            }
        }
    }

    // Helper to calculate Star and Reversal
    const calcStar = (baseStar: number, locIndex: number, houseDragon: 'sky' | 'earth' | 'human', isShenShi: boolean): { star: number, reversed: boolean } => {
        let finalStar = baseStar;

        // 1. Determine Home Gua of the Star
        let guaIndex = STAR_TO_GUA[baseStar];

        // Handle Star 5 (Wu Huang)
        // If Star is 5, it adopts the nature of the Palace it is currently in (in the Period Chart)
        if (baseStar === 5) {
            guaIndex = LOC_INDEX_TO_GUA[locIndex];
        }

        // 2. Find the specific mountain in that Gua corresponding to house's Dragon
        const targetMountain = getTrigramMountain(guaIndex, houseDragon);

        // 3. Apply Replacement if needed
        if (isReplacement) {
            // Lookup replacement
            if (!isShenShi) {
                finalStar = REPLACEMENT_STARS_ZZ[targetMountain];
            } else {
                finalStar = REPLACEMENT_STARS[targetMountain];
            }
        }

        // 4. Determine Reversals (Yin/Yang)
        // Use the Yin/Yang of the Mountain mapped to the Final Star
        // Wait, "Use original mountain's Yin/Yang" (from text).
        // "Using 6 to replace... 6 entering center... Yin/Yang decided by Si mountain (Original)"
        // Si mountain was 'targetMountain' found in Step 2.
        // So check Yin/Yang of targetMountain.
        const yinYang = getYuanLongFromMountainIndex(targetMountain).yinYang;

        return {
            star: finalStar,
            reversed: yinYang === 'yin' // Yang -> Forward (false), Yin -> Reverse (true)
        };
    };

    // Calculate Mountain Star
    // Sitting Dragon (House Sitting)
    const oppositeIndex = (mainIndex + 12) % 24;
    const sittingDragon = getYuanLongFromMountainIndex(oppositeIndex).long;
    const mRes = calcStar(baseMountainStar, mountainStarLoc, sittingDragon, isShenShi);

    // Calculate Water Star
    // Facing Dragon (House Facing)
    const facingDragon = getYuanLongFromMountainIndex(mainIndex).long;
    const wRes = calcStar(baseWaterStar, waterStarLoc, facingDragon, isShenShi);

    return {
        mainFacing,
        subFacing,
        mountainStar: mRes.star,
        mountainReversed: mRes.reversed,
        waterStar: wRes.star,
        waterReversed: wRes.reversed
    };

}
