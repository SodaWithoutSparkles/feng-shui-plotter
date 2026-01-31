import type { FengShuiData, FlyStarData, MountainFacingData } from '../types';

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

// Mapping of Mountain Index to Trigram (Palace) Index [0-8]
// 0:SE, 1:S, 2:SW, 3:E, 4:Center, 5:W, 6:NE, 7:N, 8:NW
// Mountain indices: 0(Zi, N), 1(Gui, N), ... 23(Ren, N)
// N (Kan): 23, 0, 1 -> Index 7
// NE (Gen): 2, 3, 4 -> Index 6
// E (Zhen): 5, 6, 7 -> Index 3
// SE (Xun): 8, 9, 10 -> Index 0
// S (Li): 11, 12, 13 -> Index 1
// SW (Kun): 14, 15, 16 -> Index 2
// W (Dui): 17, 18, 19 -> Index 5
// NW (Qian): 20, 21, 22 -> Index 8
const MOUNTAIN_TO_FLYSTAR_INDEX = [
    7, 7, // Zi, Gui
    6, 6, 6, // Chou, Gen, Yin
    3, 3, 3, // Jia, Mao, Yi
    0, 0, 0, // Chen, Xun, Si
    1, 1, 1, // Bing
    1, 1, // Wu, Ding
    2, 2, 2, // Wei, Kun, Shen
    5, 5, 5, // Geng, You, Xin
    8, 8, 8, // Xu, Qian, Hai
    7 // Ren
];

// Mapping Mountain Index to its original Trigram Lo Shu Number (1-9)
// N(1), NE(8), E(3), SE(4), S(9), SW(2), W(7), NW(6)
const MOUNTAIN_TO_LOSHU = [
    1, 1, // Zi, Gui
    8, 8, 8, // Chou, Gen, Yin
    3, 3, 3, // Jia, Mao, Yi
    4, 4, 4, // Chen, Xun, Si
    9, 9, 9, // Bing, Wu, Ding
    2, 2, 2, // Wei, Kun, Shen
    7, 7, 7, // Geng, You, Xin
    6, 6, 6, // Xu, Qian, Hai
    1 // Ren
];

// Yin/Yang polarity of the 24 Mountains
// True = Yang (Forward), False = Yin (Backward)
// Indices based on MOUNTAINS_24 standard order (Zi, Gui, etc.)
// Check: Zi(Tian,-), Gui(Ren,-), Chou(Di,-), Gen(Tian,+), Yin(Ren,+), Jia(Di,+) ...
const MOUNTAIN_POLARITY = [
    false, false, // Zi(Yin), Gui(Yin)
    false, true, true, // Chou(Yin), Gen(Yang), Yin(Yang)
    true, false, false, // Jia(Yang), Mao(Yin), Yi(Yin)
    false, true, true, // Chen(Yin), Xun(Yang), Si(Yang)
    true, // Bing(Yang)
    false, false, // Wu(Yin), Ding(Yin)
    false, true, true, // Wei(Yin), Kun(Yang), Shen(Yang)
    true, false, false, // Geng(Yang), You(Yin), Xin(Yin)
    false, true, true, // Xu(Yin), Qian(Yang), Hai(Yang)
    true // Ren(Yang)
];

// Replacement Star Map (Ti Gua)
// Maps Mountain Index to the Replacement Star Number
const REPLACEMENT_MAP = [
    1, 1, // Zi, Gui -> 1
    7, 7, 9, // Chou, Gen -> 7, Yin -> 9
    1, 2, 2, // Jia -> 1, Mao, Yi -> 2
    6, 6, 6, // Chen, Xun, Si -> 6
    7, 9, 9, // Bing -> 7, Wu, Ding -> 9
    2, 2, 1, // Wei, Kun -> 2, Shen -> 1
    9, 7, 7, // Geng -> 9, You, Xin -> 7
    6, 6, 6, // Xu, Qian, Hai -> 6
    2 // Ren -> 2
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

    return {
        blacks: genFlyStarSeq(fengShuiData.blacks.start),
        reds: genFlyStarSeq(fengShuiData.reds.start, fengShuiData.reds.reversed),
        blues: genFlyStarSeq(fengShuiData.blues.start, fengShuiData.blues.reversed),
        purples: genFlyStarSeq(fengShuiData.purples.start + offset)
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

export function getMountainIndex(angle: number): number {
    return Math.floor((normalizeAngle(angle) + 7.5) / 15) % 24;
}

function checkJian(angle: number, mainIndex: number): number | null {
    // 24 mountains, each 15 degrees.
    // Center of mountain[0] (Zi) is 0 deg.
    // Center of mountain[k] is k*15 deg?
    // Map: 0->0, 1->15, 23->345 (-15).
    // Normalize logic:
    // If index is 23 (Ren), center is 345.
    // diff = angle - 345.

    // Proper way to get center angle of an index mapping to my array:
    // array: Zi(0), Gui(1)...
    // Zi is N2 (0 deg). Gui is N3 (15 deg).
    let centerAngle = mainIndex * 15;
    if (mainIndex === 23) centerAngle = 345;
    else if (mainIndex === 0 && angle > 300) centerAngle = 360; // wrap wrap

    let diff = normalizeAngle(angle - centerAngle);
    if (diff > 180) diff -= 360;

    // "Middle 9 degrees" means +/- 4.5
    if (Math.abs(diff) <= 4.5) return null;

    // It is Jian.
    // > 4.5 means clockwise to next
    // < -4.5 means counter-clock to prev
    const offset = (diff > 0) ? 1 : -1;
    return (mainIndex + offset + 24) % 24;
}

export function getMountainFacingFromAngle(
    facingAngle: number,
    period: number // 元運
): MountainFacingData {

    // Normalize angle to [0, 360)
    let angle = normalizeAngle(facingAngle);

    // 1. Determine Main Facing and Sitting Mountains
    const facingIndex = getMountainIndex(angle);
    const sittingAngle = (angle + 180) % 360;
    const sittingIndex = getMountainIndex(sittingAngle);

    const mainFacing = MOUNTAINS_24[facingIndex];

    // 2. Check for Jian (Sub facing)
    const jianIndex = checkJian(angle, facingIndex);
    const subFacing = jianIndex !== null ? MOUNTAINS_24[jianIndex] : null;

    // 3. Generate Period Chart (Earth Plate)
    // Center star is period.
    const periodSeq = genFlyStarSeq(period, false);

    // Get Flying Star Index for Sitting and Facing
    const sittingLocIndex = MOUNTAIN_TO_FLYSTAR_INDEX[sittingIndex];
    const facingLocIndex = MOUNTAIN_TO_FLYSTAR_INDEX[facingIndex];

    let mountainStar = periodSeq[sittingLocIndex] as number;
    let waterStar = periodSeq[facingLocIndex] as number;

    // 4. Determine if Replacement (Ti Gua) is needed
    // Condition: Jian exists AND (Different Trigram OR (Same Trigram but Diff Polarity))
    let useReplacement = false;
    if (jianIndex !== null) {
        const mainGua = MOUNTAIN_TO_LOSHU[facingIndex];
        const jianGua = MOUNTAIN_TO_LOSHU[jianIndex];

        if (mainGua !== jianGua) {
            useReplacement = true; // Out of Gua, always replace
        } else {
            // Same Gua, check polarity match
            if (MOUNTAIN_POLARITY[facingIndex] !== MOUNTAIN_POLARITY[jianIndex]) {
                useReplacement = true; // Yin-Yang mixed, replace
            }
        }
    }

    if (useReplacement) {
        // Substitute the stars
        // We use the 24-mountain of the *original* star location to find the replacement?
        // NO.
        // We look at the Period Star Number (e.g. 4)
        // We look at the Original Palace of that Star (SE).
        // We find the specific mountain in SE that corresponds to the Yuan Long of the *Sitting/Facing*.
        // Then we check the Replacement map for THAT mountain.

        // Helper to find specific mountain for a Star Number and a Yuan Long
        const findMountainForStar = (star: number, yuanLongIndex: number /* 0,1,2 */) => {
            // Star number maps to a Trigram (Lo Shu).
            // Star 1 -> Kan. Mountains: Ren(23, Di), Zi(0, Tian), Gui(1, Ren).
            // We need to pick one based on yuanLongIndex.
            // My yuanLongIndex: 0=Tian, 1=Ren, 2=Di.
            // Map based on loop:
            // If star=1. Zi(0)=Tian, Gui(1)=Ren, Ren(23)=Di.
            // Warning: Order in MOUNTAIN_TO_LOSHU is sequential.
            // Let's iterate MOUNTAIN_TO_LOSHU to find range for Star.
            // Then pick based on Yuan Long.

            // Since indices are 0..23.
            // Zi(0, Tian), Gui(1, Ren), Chou(2, Di), Gen(3, Tian)...
            // So:
            // if matches star, check index % 3.
            // For star=1 (Kan), indices are 23, 0, 1.
            // 23%3=2 (Di). 0%3=0 (Tian). 1%3=1 (Ren).
            // Correct.
            // Exception: 5. 5 has no mountains.
            // If star is 5, we use the PERIOD number? No.
            // If 5, we use the *Period Number*'s mountains? No.
            // If star is 5, no replacement? Or use Period?
            // Standard: "If 5, use the Period Number".
            let targetStar = star;
            if (targetStar === 5) targetStar = period;

            for (let i = 0; i < 24; i++) {
                if (MOUNTAIN_TO_LOSHU[i] === targetStar) {
                    // Found the Gua.
                    // Now check Yuan Long.
                    if (i % 3 === yuanLongIndex) {
                        return i;
                    }
                }
            }
            return 0; // Fallback
        };

        const sittingYuanLong = sittingIndex % 3;
        const facingYuanLong = facingIndex % 3;

        const mntRefIdx = findMountainForStar(mountainStar, sittingYuanLong);
        mountainStar = REPLACEMENT_MAP[mntRefIdx];

        const wtrRefIdx = findMountainForStar(waterStar, facingYuanLong);
        waterStar = REPLACEMENT_MAP[wtrRefIdx];
    }

    // 5. Determine Flight Direction
    // Identify the "Base Mountain" polarity to fly forward/backward
    // MOUNTAIN STAR:
    // Get the *Original Palace* of the Mountain Star Number. 
    // (If 5, use Period's Palace? No, if 5, use Palace where it is *Sitting*? i.e. The Base Star of that sector?)
    // Standard rule: 5 follows the Palace of the location it is at.
    // e.g. If Mountain Star is 5, and it is at Sitting (N). N is Kan (1). Use Kan.
    // Find the Yuan Long mountain of that Palace.

    const getFlightPolarity = (star: number, locationIndex: number, yuanLong: number) => {
        let checkStar = star;
        if (checkStar === 5) {
            // Use the Lo Shu number of the location
            checkStar = MOUNTAIN_TO_LOSHU[locationIndex];
        }

        // Find the mountain for this star matching the yuan long
        // Note: locationIndex is the *physical* mountain index (0-23).
        // checkStar is the number (1-9).
        // yuanLong is the type (0,1,2).

        let refIndex = -1;
        for (let i = 0; i < 24; i++) {
            if (MOUNTAIN_TO_LOSHU[i] === checkStar) {
                if (i % 3 === yuanLong) {
                    refIndex = i;
                    break;
                }
            }
        }

        if (refIndex === -1) return true; // Default Yang
        return MOUNTAIN_POLARITY[refIndex];
    };

    const mountainReversed = !getFlightPolarity(mountainStar, sittingIndex, sittingIndex % 3);
    const waterReversed = !getFlightPolarity(waterStar, facingIndex, facingIndex % 3);

    return {
        mainFacing,
        subFacing,
        mountainStar,
        mountainReversed,
        waterStar,
        waterReversed
    };

}
