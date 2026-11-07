#!/usr/bin/env python3
"""穷举可信 Python 模型的有限可达图，检查状态不变量并保留最短反例。"""
from __future__ import annotations

import argparse
from collections import deque
import importlib.util
from pathlib import Path
import sys


def positive(value: str) -> int:
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("预算必须是正整数")
    return number


def load_model(file: Path):
    spec = importlib.util.spec_from_file_location("checked_local_model", file)
    if spec is None or spec.loader is None:
        raise ValueError("无法加载模型文件")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    sys.path.insert(0, str(file.parent))
    spec.loader.exec_module(module)
    if not callable(getattr(module, "initial_states", None)):
        raise ValueError("模型必须提供 initial_states()")
    if not callable(getattr(module, "transitions", None)):
        raise ValueError("模型必须提供 transitions(state)")
    rules = getattr(module, "INVARIANTS", None)
    if not isinstance(rules, dict) or not rules:
        raise ValueError("模型必须提供非空 INVARIANTS 字典")
    if any(not isinstance(name, str) or not callable(rule) for name, rule in rules.items()):
        raise ValueError("INVARIANTS 必须把规则名称映射到布尔检查函数")
    return module


def check(module, max_states: int, max_transitions: int, deadlocks: bool):
    # 父指针由广度优先搜索首次发现时记录，因此反例按步数最短。
    parents = {}
    pending = deque()
    violations = {}
    complete = True
    edges = 0
    processed = 0
    deadlock_rule = "NoDeadlock"
    while deadlock_rule in module.INVARIANTS:
        deadlock_rule = "CHECK_" + deadlock_rule

    def add(state, parent, action):
        nonlocal complete
        hash(state)  # 要求状态不可变且可哈希，防止搜索期间键发生变化。
        if state in parents:
            return True
        if len(parents) >= max_states:
            complete = False
            return False
        parents[state] = (parent, action)
        pending.append(state)
        for name, rule in module.INVARIANTS.items():
            result = rule(state)
            if type(result) is not bool:
                raise ValueError(f"规则 {name} 必须返回 bool")
            if not result:
                violations.setdefault(name, state)
        return True

    for initial in module.initial_states():
        if not add(initial, None, None):
            break
    if not parents:
        raise ValueError("模型没有初始状态，不能把空搜索称为通过")
    while pending and complete:
        state = pending.popleft()
        outgoing = False
        for action, successor in module.transitions(state):
            if not isinstance(action, str) or not action:
                raise ValueError("每个迁移动作必须有非空字符串名称")
            if edges >= max_transitions:
                complete = False
                break
            edges += 1
            outgoing = True
            if not add(successor, state, action):
                break
        if not outgoing and deadlocks and complete:
            violations.setdefault(deadlock_rule, state)
        processed += 1
    return parents, violations, complete, processed, edges, deadlock_rule if deadlocks else None


def report(module, result, max_states: int, max_transitions: int):
    parents, violations, complete, processed, edges, deadlock_rule = result
    describe = getattr(module, "describe", repr)
    lines = [
        "# 有限状态不变量检查", "",
        f"已发现 {len(parents)} 个状态，处理 {processed} 个状态、{edges} 条迁移。",
        f"预算：{max_states} 个状态、{max_transitions} 条迁移。",
        f"搜索完成：{'是，已穷尽模型生成的可达图' if complete else '否，达到预算；其余状态与规则结论未知'}。",
        "范围：仅此模型生成的状态与迁移；不检查时序属性、公平性或任意规模。", "",
    ]
    for name in [*module.INVARIANTS, *([deadlock_rule] if deadlock_rule else [])]:
        status = "发现反例" if name in violations else "在完整可达图中成立" if complete else "已探索部分未发现反例，未完成验证"
        lines.append(f"- {name}：{status}。")
    for name, state in violations.items():
        path = []
        current = state
        while True:
            parent, action = parents[current]
            path.append((action, current))
            if action is None:
                break
            current = parent
        path.reverse()
        lines.extend(["", f"## 反例：{name}", "", f"最短路径共 {len(path) - 1} 步：", ""])
        for index, (action, item) in enumerate(path):
            lines.append(f"{index}. {action + '：' if action else ''}{describe(item)}")
    lines.extend(["", "该结果不是 TLC 执行结果，也不保证真实系统无缺陷；代码映射、原子性与环境假设仍须核对。"])
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path, help="可信本地 Python 模型文件")
    parser.add_argument("--max-states", required=True, type=positive, help="本次状态预算")
    parser.add_argument("--max-transitions", type=positive, default=100000, help="本次迁移预算，默认 100000")
    parser.add_argument("--deadlocks", action="store_true", help="同时把没有后继迁移的状态视为死锁")
    parser.add_argument("--out", type=Path, help="可选 Markdown 输出文件；必须尚不存在")
    args = parser.parse_args()
    try:
        model = load_model(args.model.resolve(strict=True))
        result = check(model, args.max_states, args.max_transitions, args.deadlocks)
        text = report(model, result, args.max_states, args.max_transitions)
        if args.out:
            with args.out.open("x", encoding="utf-8") as file:
                file.write(text)
        print(text, end="")
        return 1 if result[1] else 0 if result[2] else 3
    except Exception as error:
        print(f"检查无法完成：{error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
