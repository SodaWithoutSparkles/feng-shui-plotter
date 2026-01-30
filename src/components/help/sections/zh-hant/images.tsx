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
        </div>
    )
};
