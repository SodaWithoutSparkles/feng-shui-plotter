import type { HelpSection } from '../types';

export const imagesHelpSection: HelpSection = {
    id: 'images',
    title: '圖片',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                你可以將圖片插入畫布以便描摹或添加註解。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">透過 Header → Edit 插入</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">插入本地圖片 (Insert Local Image):</span> 從電腦選擇圖像檔案。</li>
                    <li><span className="text-gray-100 font-semibold">插入遠端圖片 (Insert Remote Image):</span> 貼上圖片 URL 並將其放置在畫布上。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">從剪貼簿貼上</h4>
                <p className="text-gray-300">
                    你可以直接從剪貼簿貼上圖片，或貼上圖片 URL。圖片會插入到畫布中心。
                </p>
            </div>
            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">調整圖片</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>選中圖片後使用控制點調整大小或旋轉。</li>
                    <li>使用物件設定面板調整不透明度。</li>
                    <li>使用 Delete 鍵刪除圖片。</li>
                </ul>
            </div>
            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">注意：</strong> 使用遠端圖片時，本工具會嘗試從該 URL 加載圖片。這將會暴露你的 IP 地址給圖片所在的伺服器。請僅使用你信任的來源。
                同時，某些網站可能會阻止圖片被嵌入到其他網站（CORS），導致圖片無法顯示。
            </div>
        </div>
    )
};
