import type { HelpSection } from '../types';

export const fengShuiHelpSection: HelpSection = {
    id: 'fengshui',
    title: '风水 (FengShui)',
    content: (
        <div className="space-y-4 text-sm text-gray-200">
            <p className="text-gray-300">
                本软件内置风水计算引擎，可自动生成飞星图 (Fly Star)。相关控件位于专案设置 (File → Configure Project) 和右侧的飞星面板中。
            </p>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">基本参数设置</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-gray-100 font-semibold">房屋落成年份 (House Completed):</span> 输入房屋建成的年份，系统将自动建议对应的元运。</li>
                    <li><span className="text-gray-100 font-semibold">元运 (Yun/Period):</span> 选择一至九运 (例如: 2024年后为九运)。此设置决定地盘 (运星) 的分布。</li>
                    <li><span className="text-gray-100 font-semibold">坐向 (Facing Direction):</span> 使用滑杆设置精确角度。系统支持二十四山 (24 Mountains)，并会自动判断:
                        <ul className="list-disc pl-5 mt-1 text-gray-400">
                            <li><span className="text-gray-200">正向</span> (Main)</li>
                            <li><span className="text-gray-200">兼向</span> (Replacement/Sub): 当角度接近两山交界 (兼线) 时，系统会自动应用替卦星盘。</li>
                        </ul>
                    </li>
                    <li><span className="text-gray-100 font-semibold">流年飞星 (Annual Star):</span> 设置当前年份，以计算紫色流年飞星的变化。</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">飞星颜色与位置参考</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><span className="text-blue-300 font-semibold">蓝色 (Blue):</span> 向星 (水星)，位于每格左上角。</li>
                    <li><span className="text-gray-200 font-semibold">黑色 (Black):</span> 运星 (地盘)，位于每格左下 (中文数字)。</li>
                    <li><span className="text-red-300 font-semibold">红色 (Red):</span> 山星 (座星)，位于每格右上角。</li>
                    <li><span className="text-purple-300 font-semibold">紫色 (Purple):</span> 流年飞星，位于每格右下角。</li>
                </ul>
            </div>

            <p className="text-gray-400 border-t border-gray-700 pt-2 mt-2">
                调整参数后，飞星图会即时更新。若要隐藏飞星图，可使用侧边栏的开关或顶部菜单的 "Show Fly Star"。
            </p>
            <div className="rounded border border-amber-700/60 bg-amber-900/20 px-3 py-2 text-amber-200">
                <strong className="font-semibold">注意:</strong> 风水为非常复杂且具主观性的领域。
                本软件提供的计算仅供辅助参考，并不保证风水效果。
                请在实际应用中谨慎评估。本软件的开发者不对任何因使用本软件而导致的风水结果负责。
                有关各种飞星组合的详细解释，各种飞星代表的意义，各类风水布局的建议等，
                请参考相关风水书籍或咨询专业风水师。
            </div>
        </div>
    )
};
