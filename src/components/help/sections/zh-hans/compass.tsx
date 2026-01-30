import type { HelpSection } from '../types';

export const compassHelpSection: HelpSection = {
    id: 'compass',
    title: '指南针',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                罗盘具有多种模式，并可放置或旋转在平面图上显示。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">模式</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">查看 (View):</span> 显示罗盘但不可交互。</li>
                    <li><span className="text-gray-100 font-semibold">编辑（交互） (Edit (Interactive)):</span> 显示控制点，允许移动、调整大小和旋转罗盘。</li>
                    <li><span className="text-gray-100 font-semibold">投影 (Projection):</span> 显示 24 山向的投影线。</li>
                    <li><span className="text-gray-100 font-semibold">隐藏 (Hidden):</span> 隐藏罗盘。</li>
                </ul>
                <p className="text-gray-400">
                    使用底部栏（bottom bar）中的罗盘按钮循环切换这些模式。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">不透明度与半径</h4>
                <p className="text-gray-300">
                    不透明度和半径滑块位于 Header → Options 中，仅影响罗盘显示。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">置中操作流程</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                    <li>绘制包围房屋的矩形。</li>
                    <li>绘制对角线以找到中心点。</li>
                    <li>删除矩形，仅保留对角线。</li>
                    <li>将罗盘切换到编辑模式，并将其置于对角线交点处。</li>
                    <li>旋转罗盘以匹配建筑方位。</li>
                    <li>删除对角线并将罗盘返回到查看模式。</li>
                </ol>
            </div>
        </div>
    )
};
