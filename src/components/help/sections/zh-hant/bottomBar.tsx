import type { HelpSection } from '../types';

export const bottomBarHelpSection: HelpSection = {
    id: 'bottomBar',
    title: '底部資訊欄',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                底部資訊欄提供實用的狀態顯示與快速操作功能。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">功能說明</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">狀態資訊:</span> 顯示當前游標坐標 (X, Y)、畫布縮放比例 (Zoom) 以及自動儲存的狀態。</li>
                    <li><span className="text-gray-100 font-semibold">歸位 (Home):</span> 點擊 Home 按鈕可將視圖重置，使平面圖置中顯示。</li>
                    <li><span className="text-gray-100 font-semibold">羅盤 (Compass) 切換:</span> 快速切換羅盤的顯示模式 (隱藏、查看、編輯、延長綫)。</li>
                </ul>
            </div>
        </div>
    )
};
