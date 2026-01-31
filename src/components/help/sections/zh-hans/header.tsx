import type { HelpSection } from '../types';

export const headerHelpSection: HelpSection = {
    id: 'header',
    title: '顶部菜单',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                应用程序顶部的菜单栏提供了文件管理、编辑操作及全局设置的功能。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">文件 (File)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">New Project:</span> 建立新项目（会清除目前画布）。</li>
                    <li><span className="text-gray-100 font-semibold">Open Project:</span> 开启本地的 .fsp 项目文件。</li>
                    <li><span className="text-gray-100 font-semibold">Save Project:</span> 保存目前进度。若浏览器支持（如 Chrome/Edge），可直接覆盖原文件；否则会下载更新后的文件。详见「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'saveExport' }))}>保存与导出</span>」章节。</li>
                    <li><span className="text-gray-100 font-semibold">Save Project As...:</span> 另存新档，总是下载一个新文件。</li>
                    <li><span className="text-gray-100 font-semibold">Auto-save:</span> 切换自动保存功能。自动保存会在每次操作后自动保存项目，以防浏览器崩溃或意外关闭导致数据丢失。自动保存只会保存最后一个状态，不会保留历史版本，也不会上传到任何云端服务。</li>
                    <li><span className="text-gray-100 font-semibold">Configure Project:</span> 修改项目底图、座向与飞星设置。</li>
                    <li><span className="text-gray-100 font-semibold">Export as Image:</span> 将当前画布导出为图片。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">编辑 (Edit)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">Undo/Redo:</span> 撤销或重做上一步骤。</li>
                    <li><span className="text-gray-100 font-semibold">Clone Object:</span> 复制目前选取的物件。</li>
                    <li><span className="text-gray-100 font-semibold">Delete Selected:</span> 删除选取的物件。</li>
                    <li><span className="text-gray-100 font-semibold">Move Up/Down:</span> 调整物件的图层顺序（上移或下移）。</li>
                    <li><span className="text-gray-100 font-semibold">Insert Image:</span> 插入本地或远程图片至画布。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">选项 (Options)</h4>
                <p className="text-gray-300">提供罗盘的锁定、透明度及半径调整，以及查看键盘快捷键列表。</p>
            </div>
        </div>
    )
};
