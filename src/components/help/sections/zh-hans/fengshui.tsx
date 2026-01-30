import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: '风水 (FengShui)',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                风水设置为飞星图（Fly Star）提供参数。相关控件位于项目配置（File → Configure Project）和飞星面板中。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">可用设置</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">年 (Year):</span> 计算紫色数字的年份。</li>
                    <li><span className="text-gray-100 font-semibold">黑 (Blacks):</span> 起始数字。</li>
                    <li><span className="text-gray-100 font-semibold">红 (Reds):</span> 起始数字，可选择反向方向。</li>
                    <li><span className="text-gray-100 font-semibold">蓝 (Blues):</span> 起始数字，可选择反向方向。</li>
                    <li><span className="text-gray-100 font-semibold">紫 (Purples):</span> 起始数字。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">飞星颜色参考 (Fly Star color references)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">蓝色 (Blue):</span> 每格左上角的数字。</li>
                    <li><span className="text-red-300 font-semibold">红色 (Red):</span> 每格右上角的数字。</li>
                    <li><span className="text-gray-200 font-semibold">黑色 (Black):</span> 每格左下（中文数字）。</li>
                    <li><span className="text-purple-300 font-semibold">紫色 (Purple):</span> 每格右下角的数字。</li>
                </ul>
                <p className="text-gray-400">
                    本节只描述设置的含义，有关如何获得这些数字，请咨询风水大师。
                </p>
            </div>
        </div>
    )
};
