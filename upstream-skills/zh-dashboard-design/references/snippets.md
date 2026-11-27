# 代码片段

这些小巧、没有额外依赖的片段，用于那些很容易出现微妙错误的功能。采用 React + Tailwind v4，并使用 [tokens.md](tokens.md) 的 Token；逻辑可以移植到任何技术栈。纯 HTML 保留逻辑，在相同 Token 上把类名转换为 CSS（例如 `bg-accent/15` → `background: color-mix(in srgb, var(--color-accent) 15%, transparent)`）。

## 数字

```ts
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }); // 1.2k, 3.4M
export const int = (n: number) => Math.round(n).toLocaleString('en');
export const usd = (n: number, digits = 0) => n.toLocaleString('en', { style: 'currency', currency: 'USD', maximumFractionDigits: digits });
/** 总数占比：真实但极小的占比绝不显示为 0.0%。 */
export const share = (v: number) => (v === 0 ? '0%' : v < 0.1 ? '<0.1%' : v < 1 ? v.toFixed(1) + '%' : Math.round(v) + '%');
/** 将秒数格式化为时长；先四舍五入，让 119.6 显示为 2m 0s，而非 1m 60s。 */
export const duration = (s: number) => { const t = Math.round(s); return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`; };
export const plural = (n: number, word: string) => `${int(n)} ${word}${n === 1 ? '' : 's'}`;
```

## 圆整的坐标轴刻度

```ts
/** 从 0 开始、覆盖 max 的等距圆整刻度：0、500、1k、1.5k…，步长为 1、2、2.5 或 5 × 10^n。 */
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0];
  const raw = max / count, pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map(m => m * pow).find(s => s >= raw)!;
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => +(i * step).toFixed(10));
}
// 图表顶部等于最后一个刻度，用 compact.format(tick) 标注各刻度。
```

## 涨跌差标签

```tsx
/** 与上期的变化。基数极小时，写明原数值，而非用醒目的百分比。 */
export function Delta({ cur, prev, format = int, min = 5, invert = false, vs }: { cur: number; prev: number; format?: (n: number) => string; min?: number; invert?: boolean; vs?: string }) {
  if (!prev) return null;                                                     // 没有可供比较的对象。
  if (prev < min) return <span className="text-[12px] text-muted tnum">was {format(prev)}</span>;
  const d = ((cur - prev) / prev) * 100, r = Math.round(d);
  if (r === 0) return <span className="text-[12px] text-muted">±0%</span>;
  const good = invert ? d < 0 : d > 0, text = Math.abs(d) > 999 ? (d > 0 ? '10×+' : '−99%') : `${d > 0 ? '▲' : '▼'} ${Math.abs(r)}%`;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] tnum" title={`${vs ?? 'Previous period'}: ${format(prev)}`}>
      <span className={`font-medium ${good ? 'text-up' : 'text-down'}`}>{text}</span>
      {vs && <span className="text-muted">{vs}</span>}{/* 一到两个词，例如 vs Sep、yesterday。 */}
    </span>
  );
}
```

## 按相同已过去时长比较的周期窗口

```ts
/** 从本地午夜 start 到 end（最近 N 天时为当前时间）的上一窗口：紧接之前的相同天数，并截取相同已过去时长。今天 00:00–15:00 对应昨天 00:00–15:00。 */
export function previousWindow(start: number, end: number, days: number, midnightOf: (daysBefore: number) => number) {
  const prevStart = midnightOf(days);                       // start 之前 days 天的本地午夜，兼容夏令时。
  return { start: prevStart, end: Math.min(start, prevStart + (end - start) + 1) };
}
```

## 带选中填充的 KPI 指标格

```tsx
<button aria-pressed={selected} onClick={onSelect} title={explain}
  className="group relative border-b border-r border-line p-2 text-left last:border-r-0 focus-visible:outline-none">
  <div className={`h-full rounded-xl px-4 py-3 transition-colors group-focus-visible:ring-2 group-focus-visible:ring-accent ${selected
    ? (money ? 'bg-money/[.07] ring-1 ring-inset ring-money/25' : 'bg-accent/[.06] ring-1 ring-inset ring-accent/20')
    : 'group-hover:bg-soft/70'}`}>
    <div className={`flex items-center justify-between gap-2 text-[14px] ${selected ? 'font-medium text-ink' : 'text-ink-2'}`}>{label}<Delta cur={cur} prev={prev} format={format} /></div>
    <div className={`mt-1 text-[32px] font-semibold leading-[1.15] tracking-[-.03em] tnum ${selected ? 'text-ink' : 'text-ink-2'}`}>{format(cur)}</div>
    {/* 不加解释性副行；explain（例如 3% of visitors）用作卡片 title / 工具提示。 */}
    <Spark values={series /* 与主图相同的时间窗口。 */} color={!selected ? 'var(--color-muted)' : money ? 'var(--color-money)' : 'var(--color-accent)'} />
  </div>
</button>
```

## 底部带细占比条的排名列表行

```tsx
const Bar = ({ pct, money }: { pct: number; money?: boolean }) => (
  <span aria-hidden className="absolute inset-x-3 bottom-[5px] h-[3px] overflow-hidden rounded-full bg-line/70">
    <span className={`absolute inset-y-0 left-0 rounded-full opacity-75 transition-opacity group-hover:opacity-100 ${money ? 'bg-money' : 'bg-accent'}`}
      style={{ width: `${Math.max(1.5, Math.min(100, pct))}%` }} />
  </span>
);

<button className="group relative flex h-11 w-full items-center gap-3 rounded-[10px] px-3 pb-1.5 text-left text-[14px] hover:bg-soft/60" onClick={() => filterBy(row.x)}>
  <Bar pct={(100 * row.y) / max} />
  <span className="relative flex min-w-0 flex-1 items-center gap-2.5">{icon}<span className="truncate">{row.name}</span></span>
  <span className="relative tnum text-ink">{int(row.y)}</span>
  <span className="relative w-11 text-right tnum text-[13px] text-muted">{share((100 * row.y) / total)}</span>
</button>
```

## 日期范围日历（单月、无需第三方库）

```tsx
'use client';
import { useState } from 'react';

const DAY = 864e5, ymd = (t: number) => new Date(t).toISOString().slice(0, 10);
const monthOf = (d: string) => d.slice(0, 7) + '-01';
const addMonths = (first: string, n: number) => { const d = new Date(first); d.setUTCMonth(d.getUTCMonth() + n); return ymd(d.getTime()); };

/** 先点开始日，再点结束日；点击早于开始日的日期会移动开始日。日期为 UTC 午夜的 YYYY-MM-DD。 */
export function RangeCalendar({ from, to, max, min, onChange }: { from: string; to: string; max: string; min?: string; onChange: (from: string, to: string) => void }) {
  const [month, setMonth] = useState(() => monthOf(to || from || max));
  const [hover, setHover] = useState('');
  const start = Date.parse(month), lead = (new Date(start).getUTCDay() + 6) % 7;           // 星期一为一周起点。
  const days = Array.from({ length: 42 }, (_, i) => ymd(start + (i - lead) * DAY));          // 六行，避免高度跳动。
  const end = to || (from && hover > from ? hover : '');                                    // 高亮带跟随指针。
  const pick = (d: string) => (!from || to || d < from ? onChange(d, '') : onChange(from, d));
  const title = new Date(start).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <div className="select-none" onPointerLeave={() => setHover('')}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={!!min && month <= monthOf(min)} onClick={() => setMonth(m => addMonths(m, -1))} className="grid size-8 place-items-center rounded-full hover:bg-soft disabled:opacity-30">‹</button>
        <div className="text-[13.5px] font-medium" aria-live="polite">{title}</div>
        <button type="button" aria-label="Next month" disabled={month >= monthOf(max)} onClick={() => setMonth(m => addMonths(m, 1))} className="grid size-8 place-items-center rounded-full hover:bg-soft disabled:opacity-30">›</button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-muted">{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => <div key={w} className="pb-1.5">{w}</div>)}</div>
      <div className="grid grid-cols-7 gap-y-0.5" role="grid" aria-label={title}>
        {days.map((d, i) => {
          const out = d.slice(0, 7) !== month.slice(0, 7), off = d > max || (!!min && d < min);
          const isStart = d === from, isEnd = !!end && d === end, inside = !!from && !!end && d > from && d < end;
          const band = 'absolute inset-y-0 bg-accent/10';
          return (
            <div key={d} className="relative flex h-9 items-center justify-center">
              {(inside || (isEnd && !isStart)) && <span aria-hidden className={`${band} left-0 right-1/2 ${i % 7 === 0 ? 'rounded-l-full' : ''}`} />}
              {(inside || (isStart && !!end && end !== from)) && <span aria-hidden className={`${band} left-1/2 right-0 ${i % 7 === 6 ? 'rounded-r-full' : ''}`} />}
              <button type="button" disabled={off} aria-pressed={isStart || isEnd} onClick={() => pick(d)} onPointerEnter={() => setHover(d)}
                aria-label={new Date(d).toLocaleDateString('en', { dateStyle: 'full', timeZone: 'UTC' })}
                className={`relative grid size-9 place-items-center rounded-full text-[13px] tnum disabled:pointer-events-none disabled:text-line-strong
                  ${isStart || isEnd ? 'bg-accent font-medium text-on-accent' : inside ? 'text-ink' : out ? 'text-muted/60 hover:bg-soft' : 'text-ink hover:bg-soft'}`}>
                {+d.slice(8)}
                {d === max && <span aria-hidden className={`absolute bottom-1 size-1 rounded-full ${isStart || isEnd ? 'bg-on-accent' : 'bg-accent'}`} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

下面的页脚显示选中日期范围（“2026 年 10 月 6 日–17 日”）、天数，以及一个强调色“应用”按钮；两个端点未选齐前禁用。传入 `max`，其值是站点所在时区的今天（不是浏览器所在时区）。

## 忽略过时的响应

```ts
const seq = useRef(0);
async function load() {
  const n = ++seq.current;
  const body = await fetch(url).then(r => (r.ok ? r.json() : null)).catch(() => null);
  if (n !== seq.current) return;          // 新请求已经开始；此响应属于不再显示的站点/时间范围。
  body ? setData(body) : setError('Couldn’t refresh. These are the last numbers loaded; retrying in a minute.');
}
```

## 热力图分档与单元格

```tsx
/** 按有意义阈值分级；异常等级用暖色，使最严重单元格最醒目。 */
/** 越接近问题，颜色越强；最健康最浅。所有文字用墨色，强调色叠加强调色不满足 4.5:1。 */
const tier = (rate: number) => rate >= 95 ? 't1' : rate >= 90 ? 't2' : rate >= 85 ? 't3' : 'warn';
const TIER = {
  t1: 'bg-accent/[.07] text-ink-2', t2: 'bg-accent/15 text-ink', t3: 'bg-accent/25 text-ink',
  warn: 'bg-warn/30 text-ink underline decoration-2 underline-offset-2',   // 在灰度下仍然可见的非颜色提示。
};

<div role="table" aria-label="Attendance by class and day, %" className="grid gap-2"
  style={{ gridTemplateColumns: `52px repeat(${days.length}, minmax(0, 1fr))` }}>
  <span />
  {days.map((d, i) => <span key={d.iso} className="text-center text-[12px] text-muted">{d.short}<b className={`block text-[13px] tnum ${i === days.length - 1 ? 'text-accent' : 'text-ink-2'}`}>{d.day}</b></span>)}
  {rows.map(r => <Fragment key={r.name}>
    <span className="text-[13px] font-semibold text-ink-2" title={r.owner}>{r.name}</span>
    {r.cells.map((c, i) => c == null
      ? <button key={i} onClick={() => remind(r)} aria-label={`${r.name}, ${days[i].label}: not marked. Remind ${r.owner}`}
          className="grid h-9 place-items-center rounded-[10px] border-[1.5px] border-dashed border-warn/75 bg-warn/[.07] text-warn">{bell}</button>
      : <span key={i} tabIndex={0} title={`${r.name} · ${days[i].label} · ${c.present}/${c.size}`}
          className={`grid h-9 place-items-center rounded-[10px] text-[13px] font-semibold tnum ${TIER[tier(c.rate)]}`}>{Math.round(c.rate)}</span>)}
  </Fragment>)}
</div>
```

## 子弹图

```tsx
/** Few 的规格：条宽为轨道的三分之一，目标用垂直线，较差区间更深。 */
export function Bullet({ value, target, ranges, max, label }: { value: number; target: number; ranges: number[]; max: number; label: string }) {
  const pct = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  const shade = ['bg-ink/40', 'bg-ink/25', 'bg-ink/10'];   // ranges 是较差、一般、良好区间的终点；较差区间绘制在上层。
  return (
    <div className="relative isolate h-6" role="img" aria-label={`${label}: ${value} of target ${target}`}>
      {ranges.map((r, i) => <span key={i} className={`absolute inset-y-0 left-0 ${shade[i]}`} style={{ width: pct(r), zIndex: -i }} />)}
      <span className="absolute left-0 top-1/3 h-1/3 rounded-sm bg-ink" style={{ width: pct(value) }} />
      <span className="absolute inset-y-1 w-[2px] bg-ink" style={{ left: pct(target) }} />
    </div>
  );
}
```

## 分段占比条

```tsx
<div className="flex gap-1.5" role="img" aria-label={parts.map(p => `${p.label} ${compact.format(p.value)}`).join(', ')}>
  {parts.filter(p => p.value > 0).map(p => (
    <span key={p.label} title={`${p.label}: ${usd(p.value)} · ${share((100 * p.value) / total)}`}
      className="h-2.5 min-w-2.5 rounded-full" style={{ flex: p.value, background: p.color }} />
  ))}
</div>
```

## 全屏共用一个工具提示

```ts
/** 任意带 data-tip 的元素在悬停和键盘聚焦时使用同一个深色工具提示。 */
const tip = document.getElementById('tip')!;
const show = (el: HTMLElement) => {
  tip.textContent = el.dataset.tip!; tip.classList.add('show');
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2))}px`;
  tip.style.top = `${r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8}px`;   // 靠近顶部边缘时翻到下方。
};
const hide = () => tip.classList.remove('show');
for (const type of ['pointerover', 'focusin'] as const)
  document.addEventListener(type, e => { const el = (e.target as Element).closest<HTMLElement>('[data-tip]'); el ? show(el) : hide(); });
document.addEventListener('scroll', hide, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
```


## 漏斗（步骤用条形图，不用梯形）

```tsx
/** 每步宽度是它占第一步的比例；相对自身正常值下降最严重的一步使用暖色等级。 */
export function Funnel({ steps, normal }: { steps: { label: string; n: number }[]; normal?: number[] }) {
  const first = steps[0]?.n || 1;
  const drops = steps.slice(1).map((s, i) => s.n / (steps[i].n || 1));            // 相对于前一步的转化率。
  const worst = normal ? drops.map((d, i) => d / normal[i]).reduce((w, r, i, a) => (r < a[w] ? i : w), 0) : -1;
  return (
    <ol className="grid gap-3">
      {steps.map((s, i) => (
        <li key={s.label} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-3 text-sm">
          <span className="text-ink-2">{s.label}</span>
          <span className="h-3 rounded-full bg-ink/10">
            <span className={`block h-full rounded-full ${i - 1 === worst ? 'bg-warn' : 'bg-accent'}`}
              style={{ width: `${(100 * s.n) / first}%` }} />
          </span>
          <span className="text-right tnum">{compact.format(s.n)}
            {i > 0 && <span className="ml-1.5 text-ink-2">−{share(100 * (1 - drops[i - 1]))}</span>}</span>
        </li>
      ))}
    </ol>
  );
}
```

## Cohort 留存网格

```tsx
/** 行表示 cohort（最新在最后），列表示注册后周数。未来单元格留空，不写 0%。数值高是好事，因此越深越好。 */
const tier = (p: number) => (p >= 40 ? 'bg-accent/70 text-white' : p >= 25 ? 'bg-accent/40' : p >= 15 ? 'bg-accent/20' : 'bg-accent/8');
export function Cohorts({ rows }: { rows: { label: string; size: number; pct: (number | null)[] }[] }) {
  return (
    <table className="text-xs tnum">
      <tbody>{rows.map(r => (
        <tr key={r.label}>
          <th className="pr-3 text-left font-normal text-ink-2">{r.label} · {r.size}</th>
          {r.pct.map((p, w) => (
            <td key={w} className="p-0.5">
              {p == null ? <span className="block h-7 w-11" /> :
                <span className={`grid h-7 w-11 place-items-center rounded-md ${tier(p)}`} data-tip={`${r.label} · week ${w}: ${p}%`}>{Math.round(p)}%</span>}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );
}
```

## 可用性条带

```tsx
/** 每天一条细条；只有异常日期使用强色。 */
const dayColor = { up: 'bg-ink/15', degraded: 'bg-warn', down: 'bg-down', none: 'bg-ink/5' } as const;
export function Uptime({ name, days, pct }: { name: string; days: { date: string; state: keyof typeof dayColor; note?: string }[]; pct: number }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex justify-between text-sm"><span>{name}</span><span className="tnum text-ink-2">{pct.toFixed(2)}%</span></div>
      <div className="flex h-8 gap-[2px]">
        {days.map(d => <span key={d.date} className={`flex-1 rounded-[2px] ${dayColor[d.state]}`} data-tip={`${d.date}: ${d.note ?? d.state}`} />)}
      </div>
      <div className="flex justify-between text-xs text-ink-2"><span>{days.length} days ago</span><span>today</span></div>
    </div>
  );
}
```

## 排行榜行

```tsx
/** 排名 · 标志 · 名称 + 详情 · 数值 · 标明对比对象的涨跌胶囊。 */
<li className="grid grid-cols-[1.5rem_2rem_1fr_auto_auto] items-center gap-3 py-2">
  <span className="text-xs text-ink-2 tnum">{rank}</span>
  <img src={logo} alt="" className="size-7 rounded-md" />
  <span className="min-w-0"><span className="block truncate">{name}</span><span className="block truncate text-xs text-ink-2">{detail}</span></span>
  <span className="text-right tnum">{compact.format(value)}</span>
  {isNew ? <span className="rounded-full bg-ink/8 px-2 text-xs">new</span> : <Delta cur={value} prev={prev} vs="wk" />}
</li>
```

## 图表注释

```tsx
/** 对应时点一条细线，顶部放 2–3 个词的胶囊，完整说明在工具提示内。x 将日期映射为像素。 */
{notes.slice(0, 5).map(n => (
  <g key={n.at} transform={`translate(${x(n.at)},0)`}>
    <line y1={18} y2={plotHeight} className="stroke-ink/25" strokeDasharray="2 3" />
    <foreignObject x={-40} y={0} width={80} height={18}>
      <span className="mx-auto block w-fit rounded-full bg-ink/8 px-1.5 text-[10px] leading-[18px]" data-tip={n.note}>{n.label}</span>
    </foreignObject>
  </g>
))}
```
