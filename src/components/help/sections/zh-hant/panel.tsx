import type { HelpSection } from '../types';

export const panelHelpSection: HelpSection = {
    id: 'panel',
    title: '多功能面板',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                右側邊欄頂部面板負責顯示物件屬性、歷史記錄或飛星設定。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">面板切換邏輯</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">物件設定 (Object Settings):</span> 當選中一個或多個物件時，面板會自動切換至此模式，供您調整顏色、尺寸、旋轉角度等屬性。</li>
                    <li><span className="text-gray-100 font-semibold">歷史與飛星:</span> 當沒有選取任何物件時，面板會在「歷史記錄」與「飛星設定」之間切換。
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>點擊標題欄右側的切換按鈕 (雙向箭頭圖示) 可手動切換這兩個視圖。</li>
                            <li>啟用飛星顯示時，預設會切換至飛星設定面板。</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各檢視的功能</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">物件設定 (Object Settings):</span>
                        編輯已選項目的尺寸、位置、旋轉、顏色及圖層屬性。詳細操作請參考「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'objects' }))}>物件操作</span>」章節。
                    </li>
                    <li><span className="text-gray-100 font-semibold">歷史 (History):</span> 顯示最近的操作步驟。已還原 (Undo) 的步驟會以刪除線顯示，點擊可快速跳轉至該狀態。</li>
                    <li>
                        <span className="text-gray-100 font-semibold">飛星 (Fly Star):</span>
                        顯示風水參數與年份選擇器，並會標示用於計算兼向的流派（顯示為「沈氏」或「中州」）。
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>
                                <span className="font-semibold">年份控制 :</span> 顯示目前圖表年份，並提供具有預設值（例如 <span className="text-gray-200">現在</span>、<span className="text-gray-200">下一年</span>）的滑桿以便快速選擇。
                            </li>
                            <li>
                                <span className="font-semibold">日曆 (自動) :</span> 當看到日曆圖示時，飛星處於<em>自動同步</em>模式，會跟隨實際當前年份。點擊日曆可「鎖定為當前年份」，將面板切換為手動 (鎖定) 年份。
                            </li>
                            <li>
                                <span className="font-semibold">鎖定 (手動) :</span> 當顯示鎖定圖示時，圖表會固定到您選擇的指定年份。點擊鎖定可「切換回自動同步」，以恢復跟隨當前年份。手動模式可用於檢視歷史或未來年份而不會被自動更新覆蓋。
                            </li>
                        </ul>
                        <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'fengshui' }))}>詳見風水 (FengShui) 幫助章節</span>。
                    </li>
                </ul>
            </div>
        </div>
    )
};
