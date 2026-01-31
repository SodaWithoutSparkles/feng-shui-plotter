import type { HelpSection } from '../types';

export const compassHelpSection: HelpSection = {
    id: 'compass',
    title: '羅盤',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                羅盤具有多種模式，並可放置或旋轉在平面圖上顯示。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">模式</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">查看 (View):</span> 顯示羅盤但不可互動。</li>
                    <li><span className="text-gray-100 font-semibold">編輯 (互動) (Edit (Interactive)):</span> 顯示控制點，以縮放和旋轉平面圖。當 Options → Lock to South 解鎖時，旋轉將會應用到羅盤而不是平面圖。</li>
                    <li><span className="text-gray-100 font-semibold">投影 (Projection):</span> 顯示 24 山向的投影線。</li>
                    <li><span className="text-gray-100 font-semibold">隱藏 (Hidden):</span> 隱藏羅盤。</li>
                </ul>
                <p className="text-gray-400">
                    使用底部欄 (bottom bar) 中的羅盤按鈕循環切換這些模式。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">不透明度與半徑</h4>
                <p className="text-gray-300">
                    不透明度和半徑滑桿位於 Header → Options 中，僅影響羅盤顯示。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">置中操作流程</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                    <li>繪製包圍目標房屋的矩形。</li>
                    <li>繪製對角線以找到中心點。</li>
                    <li>刪除矩形，僅保留對角線。</li>
                    <li>將羅盤切換到編輯模式，並將其置於對角線交點處。</li>
                    <li>旋轉羅盤以匹配建築方位。</li>
                    <li>刪除對角線並將羅盤返回查看模式。</li>
                </ol>
            </div>
        </div>
    )
};
