import type { HelpSection } from '../types';

export const colorsHelpSection: HelpSection = {
    id: 'colors',
    title: '顏色',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                雙重顏色選擇器用於控制新形狀和已選物件的描邊 (輪廓) 和填充顏色。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">選擇顏色</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>點擊左上三角以編輯描邊顏色。</li>
                    <li>點擊右下三角以編輯填充顏色 (支援透明度)。</li>
                    <li>使用吸管 (pipette) 從畫布中直接取樣顏色。吸管只能從物件取樣，無法從平面圖或圖像中取樣。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">預設</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>點擊一個預設以套用其描邊/填充配對。</li>
                    <li>再次點擊已選預設以對其進行編輯。</li>
                    <li>使用 + 按鈕將目前的描邊/填充配對儲存為新預設。</li>
                </ul>
            </div>

            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">注意:</strong> 如果需要調整文字顔色，請使用文字工具選單中的顏色選擇器，或在物件設定面板中調整。
                詳情請參閱工具 (Tools) 和多功能面板 (Panel) 幫助章節。
            </div>
        </div>
    )
};
