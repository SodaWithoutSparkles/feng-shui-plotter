import type { HelpSection } from '../types';

export const objectsHelpSection: HelpSection = {
    id: 'objects',
    title: '物件操作',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                學會高效地選取與編輯物件，能大幅提升繪圖效率。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">選取物件 (Select)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">單選:</span> 使用選取工具（箭頭游標）點擊物件，或使用右側面板中的物件列表選取。</li>
                    <li><span className="text-gray-100 font-semibold">加選/減選:</span> 按住 Ctrl 鍵並點擊物件或物件列表，可將其加入目前的選取範圍，或從中移除。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">移動與編輯 (Move & Edit)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">拖曳移動:</span> 選取後直接拖曳物件。</li>
                    <li>
                        <span className="text-gray-100 font-semibold">批次編輯 (Bulk Edit):</span>
                        當選取多個物件時，右側面板會顯示共同屬性。此時調整顏色、外框或字體大小，將一次套用至所有選取的物件。
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">刪除與複製 (Delete & Clone)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">刪除:</span> 按下 Delete 或 Backspace 鍵刪除選取物件。</li>
                    <li><span className="text-gray-100 font-semibold">複製:</span> 按下 Ctrl + D 可複製選取的物件。</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">刪除全部</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">清空所有物件:</span> 使用 Objects 面板靠右的垃圾桶圖示按鈕，可一鍵刪除畫布上所有物件。</li>
                </ul>
            </div>

            <p className="text-gray-400 text-xs mt-2">
                更多資訊請參考「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'panel' }))}>多功能面板</span>」與「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'header' }))}>頂部選單</span>」章節。
            </p>
        </div>
    )
};
