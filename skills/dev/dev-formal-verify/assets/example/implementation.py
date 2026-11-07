"""用于演示的真实纯函数；每次调用作为枚举器的一个原子步骤。"""
from dataclasses import dataclass


@dataclass(frozen=True)
class State:
    available: int = 1
    phases: tuple[int, int] = (0, 0)
    held: frozenset[int] = frozenset()


def read_available(state: State, actor: int) -> State | None:
    if state.phases[actor] != 0 or state.available < 1:
        return None
    phases = list(state.phases)
    phases[actor] = 1
    return State(state.available, tuple(phases), state.held)


def commit_reservation(state: State, actor: int) -> State | None:
    if state.phases[actor] != 1:
        return None
    # 必须在提交这一原子步骤中重新检查，不能沿用先前读取结果。
    if state.available < 1:  # 故障注入只移除此处保护。
        return None
    phases = list(state.phases)
    phases[actor] = 2
    return State(state.available - 1, tuple(phases), state.held | {actor})
