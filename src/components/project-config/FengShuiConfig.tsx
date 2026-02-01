import React from 'react';
import { Calendar, Compass } from 'lucide-react';
import { PopoverSlider } from '../common/PopoverSlider';
import type { FengShuiMethod } from '../../types';

interface FengShuiConfigProps {
    houseYear: number;
    period: number;
    method: FengShuiMethod;
    facingAngle: number;
    facingInfo: { main: string; sub: string | null };
    sittingName: string;
    annualYear: number;
    purpleStar: number;
    currentYear: number;
    onHouseYearChange: (val: number) => void;
    onPeriodChange: (val: number) => void;
    onMethodChange: (val: FengShuiMethod) => void;
    onFacingAngleChange: (val: number) => void;
    onAnnualYearChange: (val: number) => void;
}

export const FengShuiConfig: React.FC<FengShuiConfigProps> = ({
    houseYear,
    period,
    method,
    facingAngle,
    facingInfo,
    sittingName,
    annualYear,
    purpleStar,
    currentYear,
    onHouseYearChange,
    onPeriodChange,
    onMethodChange,
    onFacingAngleChange,
    onAnnualYearChange
}) => {
    return (
        <div className="space-y-6 flex flex-col">
            <div className="flex items-center justify-between shrink-0 h-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                        <Compass size={18} className="text-purple-400" />
                        Feng Shui Calculation
                    </h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={method}
                            onChange={(e) => onMethodChange(e.target.value as FengShuiMethod)}
                            className="bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="shen_shi_3">沈氏玄空 (3°)</option>
                            <option value="shen_shi_45">沈氏玄空 (4.5°)</option>
                            <option value="zhong_zhou_3">中州 (3°)</option>
                            <option value="zhong_zhou_45">中州 (4.5°)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 space-y-6 shrink-0">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 border-r border-gray-700 pr-4">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                House Completed
                            </label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="number"
                                    value={houseYear}
                                    onChange={(e) => onHouseYearChange(parseInt(e.target.value))}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 pl-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                Yun (Period)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => onPeriodChange(p)}
                                        className={`h-8 rounded text-sm font-medium transition-all ${period === p
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] bg-gray-700/50"></div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3 border-r border-gray-700 pr-4">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Facing Direction
                        </label>

                        <div className="flex items-center gap-4">
                            <PopoverSlider
                                value={facingAngle}
                                onChange={onFacingAngleChange}
                                min={0}
                                max={360}
                                step={0.5}
                                buttonStep={3}
                                bigStep={15}
                                unit="°"
                                presetsCols={3}
                                presetsMaxRows={5}
                                presetsScrollable={true}
                                presets={[
                                    // 子山 (352.5-7.5°)
                                    { label: '坐子向午', value: 180 },
                                    { label: '坐子向午兼壬丙', value: 174 },
                                    { label: '坐子向午兼癸丁', value: 186 },

                                    // 癸山 (7.5-22.5°)
                                    { label: '坐癸向丁', value: 195 },
                                    { label: '坐癸向丁兼子午', value: 189 },
                                    { label: '坐癸向丁兼丑未', value: 201 },

                                    // 丑山 (22.5-37.5°)
                                    { label: '坐丑向未', value: 210 },
                                    { label: '坐丑向未兼癸丁', value: 204 },
                                    { label: '坐丑向未兼艮坤', value: 216 },

                                    // 艮山 (37.5-52.5°)
                                    { label: '坐艮向坤', value: 225 },
                                    { label: '坐艮向坤兼丑未', value: 219 },
                                    { label: '坐艮向坤兼寅申', value: 231 },

                                    // 寅山 (52.5-67.5°)
                                    { label: '坐寅向申', value: 240 },
                                    { label: '坐寅向申兼艮坤', value: 234 },
                                    { label: '坐寅向申兼甲庚', value: 246 },

                                    // 甲山 (67.5-82.5°)
                                    { label: '坐甲向庚', value: 255 },
                                    { label: '坐甲向庚兼寅申', value: 249 },
                                    { label: '坐甲向庚兼卯酉', value: 261 },

                                    // 卯山 (82.5-97.5°)
                                    { label: '坐卯向酉', value: 270 },
                                    { label: '坐卯向酉兼甲庚', value: 264 },
                                    { label: '坐卯向酉兼乙辛', value: 276 },

                                    // 乙山 (97.5-112.5°)
                                    { label: '坐乙向辛', value: 285 },
                                    { label: '坐乙向辛兼卯酉', value: 279 },
                                    { label: '坐乙向辛兼辰戌', value: 291 },

                                    // 辰山 (112.5-127.5°)
                                    { label: '坐辰向戌', value: 300 },
                                    { label: '坐辰向戌兼乙辛', value: 294 },
                                    { label: '坐辰向戌兼巽乾', value: 306 },

                                    // 巽山 (127.5-142.5°)
                                    { label: '坐巽向乾', value: 315 },
                                    { label: '坐巽向乾兼辰戌', value: 309 },
                                    { label: '坐巽向乾兼巳亥', value: 321 },

                                    // 巳山 (142.5-157.5°)
                                    { label: '坐巳向亥', value: 330 },
                                    { label: '坐巳向亥兼巽乾', value: 324 },
                                    { label: '坐巳向亥兼丙壬', value: 336 },

                                    // 丙山 (157.5-172.5°)
                                    { label: '坐丙向壬', value: 345 },
                                    { label: '坐丙向壬兼巳亥', value: 339 },
                                    { label: '坐丙向壬兼午子', value: 351 },

                                    // 午山 (172.5-187.5°)
                                    { label: '坐午向子', value: 0 },
                                    { label: '坐午向子兼丙壬', value: 354 },
                                    { label: '坐午向子兼丁癸', value: 6 },

                                    // 丁山 (187.5-202.5°)
                                    { label: '坐丁向癸', value: 15 },
                                    { label: '坐丁向癸兼午子', value: 9 },
                                    { label: '坐丁向癸兼未丑', value: 21 },

                                    // 未山 (202.5-217.5°)
                                    { label: '坐未向丑', value: 30 },
                                    { label: '坐未向丑兼丁癸', value: 24 },
                                    { label: '坐未向丑兼坤艮', value: 36 },

                                    // 坤山 (217.5-232.5°)
                                    { label: '坐坤向艮', value: 45 },
                                    { label: '坐坤向艮兼未丑', value: 39 },
                                    { label: '坐坤向艮兼申寅', value: 51 },

                                    // 申山 (232.5-247.5°)
                                    { label: '坐申向寅', value: 60 },
                                    { label: '坐申向寅兼坤艮', value: 54 },
                                    { label: '坐申向寅兼庚甲', value: 66 },

                                    // 庚山 (247.5-262.5°)
                                    { label: '坐庚向甲', value: 75 },
                                    { label: '坐庚向甲兼申寅', value: 69 },
                                    { label: '坐庚向甲兼酉卯', value: 81 },

                                    // 酉山 (262.5-277.5°)
                                    { label: '坐酉向卯', value: 90 },
                                    { label: '坐酉向卯兼庚甲', value: 84 },
                                    { label: '坐酉向卯兼辛乙', value: 96 },

                                    // 辛山 (277.5-292.5°)
                                    { label: '坐辛向乙', value: 105 },
                                    { label: '坐辛向乙兼酉卯', value: 99 },
                                    { label: '坐辛向乙兼戌辰', value: 111 },

                                    // 戌山 (292.5-307.5°)
                                    { label: '坐戌向辰', value: 120 },
                                    { label: '坐戌向辰兼辛乙', value: 114 },
                                    { label: '坐戌向辰兼乾巽', value: 126 },

                                    // 乾山 (307.5-322.5°)
                                    { label: '坐乾向巽', value: 135 },
                                    { label: '坐乾向巽兼戌辰', value: 129 },
                                    { label: '坐乾向巽兼亥巳', value: 141 },

                                    // 亥山 (322.5-337.5°)
                                    { label: '坐亥向巳', value: 150 },
                                    { label: '坐亥向巳兼乾巽', value: 144 },
                                    { label: '坐亥向巳兼壬丙', value: 156 },
                                    // 壬山 (337.5-352.5°)
                                    { label: '坐壬向丙', value: 165 },
                                    { label: '坐壬向丙兼亥巳', value: 159 },
                                    { label: '坐壬向丙兼子午', value: 171 }
                                ]}
                            />

                            {facingInfo.main && (
                                <div className="text-2xl font-bold font-serif text-gray-200 whitespace-nowrap scale-90 origin-left">
                                    <span className="text-gray-500 mr-1 text-lg">坐</span>
                                    <span className="text-blue-300">{sittingName}</span>
                                    <span className="text-gray-500 mx-1 text-lg">向</span>
                                    <span className="text-red-300">{facingInfo.main}</span>
                                    {facingInfo.sub && (
                                        <span className="text-base ml-1 text-gray-500">
                                            (兼<span className="text-yellow-500">{facingInfo.sub}</span>)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Click the degree number to adjust.
                        </p>
                    </div>

                    <div className="space-y-3 pl-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Annual Star (Purple)
                        </label>
                        <div className="flex gap-4 items-center h-10 justify-start">
                            <div className="w-28 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center p-2">
                                <PopoverSlider
                                    value={annualYear}
                                    onChange={onAnnualYearChange}
                                    min={1900}
                                    max={2100}
                                    step={1}
                                    bigStep={10}
                                    hideSlider={true}
                                    presets={[
                                        { label: `Now (${currentYear})`, value: currentYear },
                                        { label: `Next (${currentYear + 1})`, value: currentYear + 1 }
                                    ]}
                                />
                            </div>
                            <div className="text-sm text-gray-400 whitespace-nowrap">
                                Purple: <span className="text-purple-400 font-bold text-lg ml-1">{purpleStar}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
