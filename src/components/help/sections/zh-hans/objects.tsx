import type { HelpSection } from '../types';

export const objectsHelpSection: HelpSection = {
    id: 'objects',
    title: '物件操作',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                学会高效地选取与编辑物件，能大幅提升绘图效率。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">选取物件 (Select)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">单选:</span> 使用选取工具 (箭头游标) 点击物件，或使用右侧面板中的物件列表选取。</li>
                    <li><span className="text-gray-100 font-semibold">加选/减选:</span> 按住 Ctrl 键并点击物件或物件列表，可将其加入目前的选取范围，或从中移除。</li>
                    <li><span className="text-gray-100 font-semibold">全选:</span> 在右侧物件列表中按下 Ctrl + A 可选取所有物件。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">移动与编辑 (Move & Edit)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">拖曳移动:</span> 选取后直接拖曳物件。</li>
                    <li>
                        <span className="text-gray-100 font-semibold">批量编辑 (Bulk Edit):</span>
                        当选取多个物件时，右侧面板会显示共同属性。此时调整颜色、外框或字体大小，将一次套用至所有选取的物件。
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">删除与复制 (Delete & Clone)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">删除:</span> 按下 Delete 或 Backspace 键删除选取物件。</li>
                    <li><span className="text-gray-100 font-semibold">复制:</span> 按下 Ctrl + D 可复制选取的物件。</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">删除全部</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">清空所有物件:</span> 使用 Objects 面板靠右的垃圾桶图标按钮，可一键删除画布上所有物件。</li>
                </ul>
            </div>

            <p className="text-gray-400 text-xs mt-2">
                更多信息请参考「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'panel' }))}>多功能面板</span>」与「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'header' }))}>顶部菜单</span>」章节。
            </p>
        </div>
    )
};
