import type { HelpSection } from '../types';

export const saveExportHelpSection: HelpSection = {
    id: 'saveExport',
    title: '保存与导出',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                本应用程序支持多种保存方式，确保您的设计不会丢失。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">保存项目 (Save Project)</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">原地保存 (In-place Save):</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>支持 Chrome/Edge 等浏览器 (需授权文件存取)。</li>
                            <li>直接写入原文件，无需重复下载。</li>
                            <li>
                                <span className="text-yellow-400 text-opacity-90">警告:</span>
                                若清空画布后保存，原文件内容也会被清空。
                            </li>
                            <li>若不支持或未授权，将自动下载新 <code>.fsp</code> 文件。</li>
                        </ul>
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">下载保存 (Download):</span>
                        若浏览器不支持或未授权，点击保存时会自动下载一个新的 <code>.fsp</code> 文件至您的下载文件夹。
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">另存新档 (Save As)</h4>
                <p className="text-gray-300">
                    无论目前的文件状态为何，「另存新档」总是会弹出对话框让您命名并下载一个全新的项目文件。
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">自动保存 (Auto-save)</h4>
                <p className="text-gray-300">
                    开启此选项后，系统会定期将项目状态备份至浏览器的 LocalStorage。若不慎重新整理页面或浏览器崩溃，下次开启网页时会尝试从备份还原。
                    <br />
                    <span className="text-yellow-400 text-xs text-opacity-80">注意: 清除浏览器缓存将会遗失自动保存的数据，重要项目请务必手动保存文件。</span>
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">导出图片 (Export Image)</h4>
                <p className="text-gray-300">
                    将目前的画布内容 (包含底图、物件及罗盘层) 合并导出为一张图片。
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>
                        <span className="text-gray-100 font-semibold">选项设置:</span>
                        在弹出的对话框中选择图片格式 (PNG 或 JPEG) 及解析度 (1x、2x、4x)。
                    </li>
                    <li>
                        <span className="text-gray-100 font-semibold">飞星图位置:</span>
                        <ul className="list-[circle] pl-5 mt-1 space-y-1 text-gray-400">
                            <li>飞星图共有 25 种位置配置模式。</li>
                            <li>若不需要在导出图中显示飞星图，请选择 <strong>[22]</strong> (正中央) 模式。</li>
                            <li>其他模式会将飞星图放置于图片的特定位置，请自行尝试。</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
};
