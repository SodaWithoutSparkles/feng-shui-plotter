import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: '風水 (FengShui)',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                本軟體內置風水計算引擎，可自動生成飛星圖 (Fly Star)。相關控制項位於專案設定 (File → Configure Project) 和右側的飛星面板中。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">基本參數設定</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">房屋落成年份 (House Completed):</span> 輸入房屋建成的年份，系統將自動建議對應的元運。</li>
                    <li><span className="text-gray-100 font-semibold">元運 (Yun/Period):</span> 選擇一至九運 (例如: 2024年後為九運)。此設定決定地盤 (運星) 的分佈。</li>
                    <li><span className="text-gray-100 font-semibold">坐向 (Facing Direction):</span> 使用滑桿設定精確角度。系統支援二十四山 (24 Mountains)，並會自動判斷:
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li><span className="text-gray-200">正向</span> (Main)</li>
                            <li><span className="text-gray-200">兼向</span> (Replacement/Sub): 當角度接近兩山交界 (兼線) 時，系統會自動應用替卦星盤。</li>
                        </ul>
                    </li>
                    <li><span className="text-gray-100 font-semibold">流年飛星 (Annual Star):</span> 設定當前年份，以計算紫色流年飛星的變化。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">飛星顏色與位置參考</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">藍色 (Blue):</span> 向星 (水星)，位於每格左上角。</li>
                    <li><span className="text-gray-200 font-semibold">黑色 (Black):</span> 運星 (地盤)，位於每格左下 (中文數字)。</li>
                    <li><span className="text-red-300 font-semibold">紅色 (Red):</span> 山星 (座星)，位於每格右上角。</li>
                    <li><span className="text-purple-300 font-semibold">紫色 (Purple):</span> 流年飛星，位於每格右下角。</li>
                </ul>
            </div>

            <p className="text-gray-400 border-t border-gray-700 pt-2 mt-2">
                調整參數後，飛星圖會即時更新。若要隱藏飛星圖，可使用側邊欄的開關或頂部選單的 "Show Fly Star"。
            </p>
            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">注意:</strong> 風水非常複雜且具主觀性的領域。
                本軟體提供的計算僅供輔助參考，並不保證風水效果。
                請在實際應用中謹慎評估。本軟體的開發者不對任何因使用本軟體而導致的風水結果負責。
                有關各種飛星組合的詳細解釋，各種飛星代表的意義，各類風水佈局的建議等，
                請參考相關風水書籍或諮詢專業風水師。
            </div>
        </div>
    )
};
