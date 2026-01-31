import type { HelpSection } from '../types';

export const toolsHelpSection: HelpSection = {
    id: 'tools',
    title: '工具',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                左侧边栏包含绘图与选取工具。使用工具按钮切换模式并在画布上建立对象。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各工具说明</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">选取 (Select):</span> 选取并移动对象。Ctrl+点击可加入或移除选取。</li>
                    <li><span className="text-gray-100 font-semibold">矩形 (Rectangle):</span> 绘制矩形形状。按下修饰键以锁定为正方形。</li>
                    <li><span className="text-gray-100 font-semibold">椭圆 (Ellipse):</span> 绘制椭圆类。按下修饰键以锁定为圆形。</li>
                    <li><span className="text-gray-100 font-semibold">直线 (Line):</span> 绘制直线段。</li>
                    <li><span className="text-gray-100 font-semibold">箭头 (Arrow):</span> 绘制箭头。拖曳时按 Space 可新增额外线段。</li>
                    <li><span className="text-gray-100 font-semibold">注解 (Callout):</span> 放置带箭头的文字框。按下并拖曳以绘画文字框，按 Space 切换到箭头，再按 Space 新增额外箭段。</li>
                    <li><span className="text-gray-100 font-semibold">星形 (Star):</span> 绘制可调大小的五角星。</li>
                    <li><span className="text-gray-100 font-semibold">文字 (Text):</span> 绘制文字框，然后在编辑覆盖层中输入内容。</li>
                    <li><span className="text-gray-100 font-semibold">吸色器 (Color Dropper):</span> 从画布取样描边或填充颜色。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">修饰键与快捷键</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">约束 (Constrain):</span> 按住已配置的修饰键 (默认 Ctrl) 以绘制正方/圆或将直线/箭头锁定为水平/垂直。</li>
                    <li><span className="text-gray-100 font-semibold">取消 (Cancel):</span> 按取消键 (默认 Esc) 以中止绘制或文字编辑。</li>
                    <li><span className="text-gray-100 font-semibold">删除 (Delete):</span> Delete 键删除选中的对象。</li>
                    <li><span className="text-gray-100 font-semibold">图层顺序:</span> 使用 <code className="bg-gray-700 px-1 rounded text-xs">]</code> 上移一层，使用 <code className="bg-gray-700 px-1 rounded text-xs">[</code> 下移一层。</li>
                    <li><span className="text-gray-100 font-semibold">复制:</span> Ctrl+D (或 Cmd+D) 复制选中的对象。</li>
                    <li><span className="text-gray-100 font-semibold">文字保存:</span> 使用已配置的保存快捷键 (默认 Ctrl+Enter) 提交文字编辑。也可以点击文字框外的任何位置来保存。</li>
                </ul>
                <p className="text-gray-400">
                    可在 选项 → 键盘快捷键 (Options → Keyboard Shortcuts) 中自订这些按键。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">工具设置</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">各类工具:</span> 线宽。</li>
                    <li><span className="text-gray-100 font-semibold">文字/注解 (Text/Callout):</span> 字号、字型、样式、文字颜色等。</li>
                </ul>
                <p className="text-gray-400">
                    工具设置面板会在左侧边栏的活动工具旁开启。
                </p>
            </div>
        </div>
    )
};
