import type { HelpSection } from '../types';

export const imagesHelpSection: HelpSection = {
    id: 'images',
    title: '图片',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                你可以将图片插入画布以便描摹或添加注释。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">通过 Header → Edit 插入</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">插入本地图片 (Insert Local Image):</span> 从计算机选择图像文件。</li>
                    <li><span className="text-gray-100 font-semibold">插入远程图片 (Insert Remote Image):</span> 粘贴图片 URL 将其放置在画布上。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">从剪贴板粘贴</h4>
                <p className="text-gray-300">
                    你可以直接从剪贴板粘贴图片，或粘贴图片 URL。图片会插入到画布中心。
                </p>
            </div>
        </div>
    )
};
