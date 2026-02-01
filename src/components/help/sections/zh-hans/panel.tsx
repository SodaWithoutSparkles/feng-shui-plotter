import type { HelpSection } from '../types';

export const panelHelpSection: HelpSection = {
    id: 'panel',
    title: '多功能面板',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                右侧边栏顶部面板会在历史记录 (History)、飞星 (Fly Star) 和对象设置 (Object Settings) 之间自动切换。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">面板切换逻辑</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">对象设置 (Object Settings):</span> 当选中一个或多个对象时，面板会自动切换至此模式，供您调整颜色、尺寸、旋转角度等属性。详细操作请参考「<span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'objects' }))}>对象操作</span>」章节。</li>
                    <li><span className="text-gray-100 font-semibold">历史与飞星:</span> 当没有选取任何对象时，面板会在“历史记录”与“飞星设置”之间切换。
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>点击标题栏右侧的切换按钮 (双向箭头图标) 可手动切换这两个视图。</li>
                            <li>启用飞星显示时，默认会切换至飞星设置面板。</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">各视图功能</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">对象设置 (Object Settings):</span> 编辑已选项的尺寸、位置、旋转、不透明度和颜色 (支持多选)。</li>
                    <li><span className="text-gray-100 font-semibold">历史 (History):</span> 显示最近操作；已撤销的步骤会以删除线显示。</li>
                    <li>
                        <span className="text-gray-100 font-semibold">飞星 (Fly Star):</span>
                        显示风水参数与年份选择器，并会标示用于计算兼向的流派（显示为「沈氏」或「中州」）。
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li>
                                <span className="font-semibold">年份控制 : </span>显示当前图表年份并提供一个带有预设（例如 <span className="text-gray-200">现在</span>、<span className="text-gray-200">下一年</span>）的滑块以便快速选择。
                            </li>
                            <li>
                                <span className="font-semibold">日历 (自动): </span> 当看到日历图标时，飞星处于<em>自动同步</em>模式，会跟随真实当前年份。点击日历可“锁定为当前年份”，将面板切换为手动（锁定）年份。
                            </li>
                            <li>
                                <span className="font-semibold">锁定 (手动): </span> 当显示锁图标时，图表固定到您选择的指定年份。点击锁可“切换为自动同步”以恢复跟随当前年份。手动模式有助于查看历史或未来年份而不被自动更新覆盖。
                            </li>
                        </ul>
                        <span className="text-blue-400 cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent('help-navigate', { detail: 'fengshui' }))}>详见风水 (FengShui) 帮助章节</span>。
                    </li>
                </ul>
                <p className="text-gray-400">
                    有关飞星详细信息，请参阅风水 (FengShui) 帮助章节。
                </p>
            </div>
        </div>
    )
};
