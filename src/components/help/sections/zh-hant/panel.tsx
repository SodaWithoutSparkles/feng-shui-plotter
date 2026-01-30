import type { HelpSection } from '../types';

export const panelHelpSection: HelpSection = {
    id: 'panel',
    title: '多功能面板',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                右側邊欄頂部面板會在歷史（History）、飛星（Fly Star）和物件設定（Object Settings）之間自動切換。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">何時切換</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">物件設定 (Object Settings):</span> 當選中一個或多個物件時顯示。</li>
                    <li><span className="text-gray-100 font-semibold">飛星設定 (Fly Star Settings):</span> 在無選取且飛星開啟時顯示。</li>
                    <li><span className="text-gray-100 font-semibold">歷史 (History):</span> 當無選取且飛星關閉時的預設檢視。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各檢視的功能</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">物件設定 (Object Settings):</span> 編輯已選項目的尺寸、位置、旋轉、不透明度和顏色（支援多選）。</li>
                    <li><span className="text-gray-100 font-semibold">歷史 (History):</span> 顯示最近操作；已還原的步驟會以刪除線顯示。</li>
                    <li><span className="text-gray-100 font-semibold">飛星 (Fly Star):</span> 顯示圖表及年份選擇器。預設為當前年份，並可透過年份偏移自動調整。</li>
                </ul>
                <p className="text-gray-400">
                    有關飛星詳情，請參閱風水（FengShui）幫助章節。
                </p>
            </div>
        </div>
    )
};
