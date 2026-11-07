import {
  append,
  type Arrow,
  holds,
  type Labels,
  type Region,
  tupleKey,
  unkey,
  type Walk,
} from "../ir.ts";

type Move = { from: string[]; text: string; to: string[] };
type Enabled = { i: number; a: Arrow };

export function regionsLie(
  regions: Region[],
  { names, keys, sorted, drawnLabels, together }: Labels,
  { from, to, starts }: Walk,
  order: Int32Array,
) {
  if (names.length < 2) return undefined;
  const combo = (i: number) => {
    const c: string[] = [];
    for (let r = 0; r < names.length; r++) c.push(keys[r][i]);
    return c;
  };
  const words = (c: string[]) => {
    const parts: string[] = [];
    for (let i = 0; i < names.length; i++) parts.push(`${names[i]} ${unkey(c[i]).join(" / ")}`);
    return parts.join(", ");
  };
  const addMove = (moves: Map<string, Move>, m: Move) =>
    moves.set(tupleKey([m.from, m.text, m.to]), m);
  let product: string[][] = [[]];
  for (const r of regions) {
    const next: string[][] = [];
    for (const c of product)
      for (const s of r.states) if (s.start) next.push([...c, tupleKey(s.path)]);
    product = next;
  }
  const realStarts = new Set<string>();
  for (const i of starts) realStarts.add(tupleKey(combo(i)));
  for (const c of product)
    if (!realStarts.has(tupleKey(c)))
      return `区域图以 ${words(c)} 开始，而模型从不以此开始。`;
  for (const [i, r] of regions.entries())
    for (const a of r.arrows)
      if (a.condition.kind === "tuples")
        return `在 ${names[i]} 中，从 ${unkey(a.from).join(" / ")} 发出的 ${a.label} 对其他区域的依赖无法用单个“且”或“或”条件表达。`;
  const real = new Map<string, Move>();
  for (const j of sorted) {
    const before = combo(from[j]);
    const after = combo(to[j]);
    if (tupleKey(before) !== tupleKey(after))
      addMove(real, { from: before, text: drawnLabels[j], to: after });
  }
  const combos = new Map<string, string[]>();
  for (const i of order) {
    const c = combo(i);
    combos.set(tupleKey(c), c);
  }
  const drawn = new Map<string, Move>();
  for (const c of combos.values()) {
    const enabled = new Map<string, Enabled[]>();
    for (const [i, r] of regions.entries()) {
      const rest: string[] = [];
      for (let k = 0; k < c.length; k++) if (k !== i) rest.push(c[k]);
      for (const a of r.arrows)
        if (a.from === c[i] && holds(a.condition, rest)) append(enabled, a.label, { i, a });
    }
    for (const [text, list] of enabled) {
      let groups: Enabled[][] = [];
      if (together.has(text)) {
        const byRegion = new Map<number, Enabled[]>();
        for (const m of list) append(byRegion, m.i, m);
        groups = [[]];
        for (const opts of byRegion.values()) {
          const next: Enabled[][] = [];
          for (const g of groups) for (const m of opts) next.push([...g, m]);
          groups = next;
        }
      } else for (const m of list) groups.push([m]);
      for (const group of groups) {
        const to = [...c];
        for (const { i, a } of group) to[i] = a.to;
        addMove(drawn, { from: c, text, to });
      }
    }
  }
  for (const [k, extra] of drawn)
    if (!real.has(k))
      return `区域图允许 ${words(extra.from)} 通过 ${extra.text} 到达 ${words(extra.to)}，而模型从不会这样迁移。`;
  for (const [k, missing] of real)
    if (!drawn.has(k))
      return `模型会从 ${words(missing.from)} 通过 ${missing.text} 到达 ${words(missing.to)}，而区域图无法表达这次迁移。`;
  return undefined;
}
