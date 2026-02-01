#!/usr/bin/env node
import { getStarStrength } from '../src/utils/FengShui'

const LABELS: Record<number, string> = {
    2: '旺',
    1: '生',
    0: '退',
    '-1': '煞',
    '-2': '死'
}

const YUAN_NAMES = ['上元', '中元', '下元']

function periodStartYear(period: number): number {
    return 1864 + (period - 1) * 20
}

function formatRange(start: number): string {
    return `${start}年-${start + 19}年`
}

function buildTable() {
    const rows: Record<string, string | number>[] = []

    for (let p = 1; p <= 9; p++) {
        const row: Record<string, string | number> = {}
        row['三元'] = YUAN_NAMES[Math.floor((p - 1) / 3)]
        row['九運'] = `${p}運`

        for (let s = 1; s <= 9; s++) {
            const val = getStarStrength(p, s)
            row[`${s}星`] = LABELS[val] ?? String(val)
        }

        const start = periodStartYear(p)
        row['本次元運年份'] = formatRange(start)
        row['下次元運年份'] = formatRange(start + 180)

        rows.push(row)
    }

    return rows
}

function printNiceTable() {
    const rows = buildTable()

    console.log('\n三元九運九星吉凶表\n')
    console.table(rows)
    console.log('\n注: 一行表示一個元/運，`本次元運年份` 為該運本回合時間範圍，`下次元運年份` 為下一回合（+180 年）。\n')
}

// Directly run when executed as a script
printNiceTable()
