import type { HelpSection } from '../types';

export const saveExportHelpSection: HelpSection = {
    id: 'saveExport',
    title: '儲存與匯出',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                本應用程式支援多種儲存方式，確保您的設計不會遺失。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">儲存專案 (Save Project)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">原地儲存 (In-place Save):</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>支援 Chrome/Edge 等瀏覽器（需授權檔案存取）。</li>
                            <li>直接寫入原檔案，無需重複下載。</li>
                            <li>
                                <span className="text-yellow-400 text-opacity-90">警告：</span>
                                若清空畫布後儲存，原檔案內容也會被清空。
                            </li>
                            <li>若不支援或未授權，將自動下載新 <code>.fsp</code> 檔案。</li>
                        </ul>
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">下載儲存 (Download):</span>
                        若瀏覽器不支援或未授權，點擊儲存時會自動下載一個新的 <code>.fsp</code> 檔案至您的下載資料夾。
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">另存新檔 (Save As)</h4>
                <p className="text-gray-300">
                    無論目前的檔案狀態為何，「另存新檔」總是會彈出對話框讓您命名並下載一個全新的專案檔。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">自動儲存 (Auto-save)</h4>
                <p className="text-gray-300">
                    開啟此選項後，系統會定期將專案狀態備份至瀏覽器的 LocalStorage。若不慎重新整理頁面或瀏覽器崩潰，下次開啟網頁時會嘗試從備份還原。
                    <br />
                    <span className="text-yellow-400 text-xs text-opacity-80">注意：清除瀏覽器快取將會遺失自動儲存的資料，重要專案請務必手動儲存檔案。</span>
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">匯出圖片 (Export Image)</h4>
                <p className="text-gray-300">
                    將目前的畫布內容（包含底圖、物件及羅盤層）合併匯出為一張圖片。
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">選項設定：</span>
                        在彈出的對話框中選擇圖片格式（PNG 或 JPEG）及解析度（1x、2x、4x）。
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">飛星圖位置：</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>飛星圖共有 25 種位置配置模式。</li>
                            <li>若不需要在匯出圖中顯示飛星圖，請選擇 <strong>[22]</strong> (正中央) 模式。</li>
                            <li>其他模式會將飛星圖放置於圖片的特定位置，請自行嘗試。</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
};
