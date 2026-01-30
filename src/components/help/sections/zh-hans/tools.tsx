import type { HelpSection } from '../types';

export const toolsHelpSection: HelpSection = {
    id: 'tools',
    title: '工具',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                左侧边栏包含绘图和选择工具。使用工具按钮切换模式并在画布上创建对象。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各工具功能</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">选择 (Select):</span> 选择并移动对象。Ctrl+点击可添加或从选区中移除。</li>
                    <li><span className="text-gray-100 font-semibold">矩形 (Rectangle):</span> 绘制矩形形状。</li>
                    <li><span className="text-gray-100 font-semibold">椭圆 (Ellipse):</span> 绘制椭圆和圆。</li>
                    <li><span className="text-gray-100 font-semibold">直线 (Line):</span> 绘制直线段。</li>
                    <li><span className="text-gray-100 font-semibold">箭头 (Arrow):</span> 绘制箭头。拖动时按 Space 可添加额外的线段。</li>
                    <li><span className="text-gray-100 font-semibold">留言 (Callout):</span> 放置带箭头的文字框。按 Space 在框与箭头间切换，再按 Space 添加额外箭段。</li>
                    <li><span className="text-gray-100 font-semibold">星形 (Star):</span> 绘制可调大小的五角星。</li>
                    <li><span className="text-gray-100 font-semibold">文本 (Text):</span> 绘制文本框，然后在编辑覆盖层中输入文本。</li>
                    <li><span className="text-gray-100 font-semibold">吸色器 (Color Dropper):</span> 从画布采样描边或填充颜色。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">修饰键</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">约束 (Constrain):</span> 按住已配置的修饰键以绘制正方/圆或将直线/箭头锁定为水平/垂直。</li>
                    <li><span className="text-gray-100 font-semibold">取消 (Cancel):</span> 按取消键（默认 Esc）以中止绘制或文本编辑。</li>
                    <li><span className="text-gray-100 font-semibold">文本保存 (Text save):</span> 使用已配置的保存快捷键提交文本编辑。</li>
                </ul>
                <p className="text-gray-400">
                    可在 选项 → 键盘快捷键 (Options → Keyboard Shortcuts) 中配置这些键。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">工具设置</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">形状工具 (Shape tools):</span> 线宽。</li>
                    <li><span className="text-gray-100 font-semibold">文本/留言 (Text/Callout):</span> 字号、字体、字重、样式、对齐和文字颜色。</li>
                </ul>
                <p className="text-gray-400">
                    工具设置面板会在左侧边栏的活动工具旁打开。
                </p>
            </div>
        </div>
    )
};
