import type { HelpSection } from '../types';

export const headerHelpSection: HelpSection = {
    id: 'header',
    title: '頂部選單',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                應用程式頂部的選單列提供了檔案管理、編輯操作及全域設定的功能。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">檔案 (File)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">New Project:</span> 建立新專案（會清除目前畫布）。</li>
                    <li><span className="text-gray-100 font-semibold">Open Project:</span> 開啟本機的 .fsp 專案檔。</li>
                    <li><span className="text-gray-100 font-semibold">Save Project:</span> 儲存目前進度。若瀏覽器支援（如 Chrome/Edge），可直接覆寫原檔案；否則會下載更新後的檔案。詳見「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'saveExport' }))}>儲存與匯出</span>」章節。</li>
                    <li><span className="text-gray-100 font-semibold">Save Project As...:</span> 另存新檔，總是下載一個新檔案。</li>
                    <li><span className="text-gray-100 font-semibold">Auto-save:</span> 切換自動儲存功能。自動儲存會在每次操作後自動儲存專案，以防瀏覽器崩潰或意外關閉導致資料遺失。自動保存只會保存最後一個狀態，不會保留歷史版本，也不會上傳到任何雲端服務。</li>
                    <li><span className="text-gray-100 font-semibold">Configure Project:</span> 修改專案底圖、座向與飛星設定。</li>
                    <li><span className="text-gray-100 font-semibold">Export as Image:</span> 將當前畫布匯出為圖片。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">編輯 (Edit)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Undo/Redo:</span> 復原或重做上一步驟。</li>
                    <li><span className="text-gray-100 font-semibold">Clone Object:</span> 複製目前選取的物件。</li>
                    <li><span className="text-gray-100 font-semibold">Delete Selected:</span> 刪除選取的物件。</li>
                    <li><span className="text-gray-100 font-semibold">Move Up/Down:</span> 調整物件的圖層順序（上移或下移）。</li>
                    <li><span className="text-gray-100 font-semibold">Insert Image:</span> 插入本機或遠端圖片至畫布。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">選項 (Options)</h4>
                <p className="text-gray-300">提供羅盤的鎖定、透明度及半徑調整，以及查看鍵盤快捷鍵列表。</p>
            </div>
        </div>
    )
};
