import type { HelpSection } from '../types';

export const bottomBarHelpSection: HelpSection = {
    id: 'bottomBar',
    title: '底部信息栏',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                底部信息栏提供实用的状态显示与快速操作功能。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">功能说明</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">状态信息:</span> 显示当前光标坐标 (X, Y)、画布缩放比例 (Zoom) 以及自动保存的状态。</li>
                    <li><span className="text-gray-100 font-semibold">归位 (Home):</span> 点击 Home 按钮可将视图重置，使平面图居中显示。</li>
                    <li><span className="text-gray-100 font-semibold">罗盘 (Compass) 切换:</span> 快速切换罗盘的显示模式 (隐藏、查看、编辑、延长线)。</li>
                </ul>
            </div>
        </div>
    )
};
