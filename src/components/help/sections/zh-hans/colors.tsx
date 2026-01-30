import type { HelpSection } from '../types';

export const colorsHelpSection: HelpSection = {
    id: 'colors',
    title: '颜色',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                双重颜色选择器用于控制新形状和已选对象的描边（轮廓）和填充颜色。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">选择颜色</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>点击左上三角以编辑描边颜色。</li>
                    <li>点击右下三角以编辑填充颜色（支持透明度）。</li>
                    <li>使用吸管（pipette）从画布中直接采样颜色。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">预设</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>点击一个预设以应用其描边/填充配对。</li>
                    <li>再次点击已选预设以对其进行编辑。</li>
                    <li>使用 + 按钮将当前的描边/填充配对保存为新预设。</li>
                </ul>
            </div>

            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">注意：</strong> 文本（字体）颜色不在此处配置。
                请使用 `Text` 工具或对象设置来调整文本颜色。
            </div>
        </div>
    )
};
