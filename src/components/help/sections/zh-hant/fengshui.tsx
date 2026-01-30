import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: '風水 (FengShui)',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                風水設定為飛星圖（Fly Star）提供參數。相關控制項位於專案設定（File → Configure Project）和飛星面板中。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">可用設定</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">年 (Year):</span> 計算紫色數字的年份。</li>
                    <li><span className="text-gray-100 font-semibold">黑 (Blacks):</span> 起始數字。</li>
                    <li><span className="text-gray-100 font-semibold">紅 (Reds):</span> 起始數字，並可選擇反向方向。</li>
                    <li><span className="text-gray-100 font-semibold">藍 (Blues):</span> 起始數字，並可選擇反向方向。</li>
                    <li><span className="text-gray-100 font-semibold">紫 (Purples):</span> 起始數字。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">飛星顏色參考 (Fly Star color references)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">藍色 (Blue):</span> 每格左上角的數字。</li>
                    <li><span className="text-red-300 font-semibold">紅色 (Red):</span> 每格右上角的數字。</li>
                    <li><span className="text-gray-200 font-semibold">黑色 (Black):</span> 每格左下（中文數字）。</li>
                    <li><span className="text-purple-300 font-semibold">紫色 (Purple):</span> 每格右下角的數字。</li>
                </ul>
                <p className="text-gray-400">
                    本節只描述設定的含義，有關如何獲得這些數字，請咨詢風水大師。
                </p>
            </div>
        </div>
    )
};
