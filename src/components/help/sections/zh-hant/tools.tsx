import type { HelpSection } from '../types';

export const toolsHelpSection: HelpSection = {
    id: 'tools',
    title: '工具',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                左側邊欄包含繪圖與選取工具。使用工具按鈕切換模式並在畫布上建立物件。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各工具說明</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">選取 (Select):</span>
                        選取並移動物件。詳見「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'objects' }))}>物件操作</span>」。
                    </li>
                    <li><span className="text-gray-100 font-semibold">矩形 (Rectangle):</span> 繪製矩形形狀。按下修飾鍵以鎖定為正方形。</li>
                    <li><span className="text-gray-100 font-semibold">橢圓 (Ellipse):</span> 繪製橢圓類。按下修飾鍵以鎖定為圓形。</li>
                    <li><span className="text-gray-100 font-semibold">直線 (Line):</span> 繪製直線段。</li>
                    <li><span className="text-gray-100 font-semibold">箭頭 (Arrow):</span> 繪製箭頭。拖曳時按 Space 可新增額外線段。</li>
                    <li><span className="text-gray-100 font-semibold">註解 (Callout):</span> 放置帶箭頭的文字框。按下並拖曳以繪畫文字框，按 Space 切換到箭頭，再按 Space 新增額外箭段。</li>
                    <li><span className="text-gray-100 font-semibold">星形 (Star):</span> 繪製可調大小的五角星。</li>
                    <li><span className="text-gray-100 font-semibold">文字 (Text):</span> 繪製文字框，然後在編輯覆蓋層中輸入內容。</li>
                    <li><span className="text-gray-100 font-semibold">吸色器 (Color Dropper):</span> 從畫布取樣描邊或填充顏色。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">修飾鍵與快速鍵</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">約束 (Constrain):</span> 按住已配置的修飾鍵 (預設 Ctrl) 以繪製正方/圓或將直線/箭頭鎖定為水平/垂直。</li>
                    <li><span className="text-gray-100 font-semibold">取消 (Cancel):</span> 按取消鍵 (預設 Esc) 以中止繪製或文字編輯。</li>
                    <li><span className="text-gray-100 font-semibold">刪除 (Delete):</span> Delete 鍵刪除選中的物件。</li>
                    <li><span className="text-gray-100 font-semibold">圖層順序:</span> 使用 <code className="bg-gray-700 px-1 rounded text-xs">]</code> 上移一層，使用 <code className="bg-gray-700 px-1 rounded text-xs">[</code> 下移一層。</li>
                    <li><span className="text-gray-100 font-semibold">複製:</span> Ctrl+D (或 Cmd+D) 複製選中的物件。</li>
                    <li><span className="text-gray-100 font-semibold">文字儲存:</span> 使用已配置的儲存快速鍵 (預設 Ctrl+Enter) 提交文字編輯。也可以點擊文字框外的任何位置來儲存。</li>
                </ul>
                <p className="text-gray-400">
                    可在 選項 → 鍵盤快速鍵 (Options → Keyboard Shortcuts) 中自訂這些按鍵。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">工具設定</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">各類工具:</span> 線寬。</li>
                    <li><span className="text-gray-100 font-semibold">文字/註解 (Text/Callout):</span> 字號、字型、樣式、文字顏色等。</li>
                </ul>
                <p className="text-gray-400">
                    工具設定面板會在左側邊欄的活動工具旁開啟。
                </p>
            </div>

            <p className="text-gray-400 text-xs mt-2">
                更多選單操作請參考「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'header' }))}>頂部選單</span>」章節。
            </p>
        </div>
    )
};
