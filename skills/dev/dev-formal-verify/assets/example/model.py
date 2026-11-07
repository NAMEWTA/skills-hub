"""直接调用示例代码，穷举两个请求的读取与提交交错。"""
from implementation import State, read_available, commit_reservation


def initial_states():
    yield State()


def transitions(state):
    moved = False
    for actor in range(2):
        for label, function in [("读取余量", read_available), ("提交预留", commit_reservation)]:
            successor = function(state, actor)
            if successor is not None:
                moved = True
                yield f"请求 {actor + 1} {label}", successor
    if not moved:
        yield "保持当前状态", state


INVARIANTS = {
    "NoOversell": lambda state: state.available >= 0 and len(state.held) <= 1,
    "Conservation": lambda state: state.available + len(state.held) == 1,
    "HeldMeansCommitted": lambda state: all(state.phases[actor] == 2 for actor in state.held),
}


def describe(state):
    phases = {0: "未读取", 1: "已读到余量", 2: "已预留"}
    return f"剩余 {state.available}，请求 1 {phases[state.phases[0]]}，请求 2 {phases[state.phases[1]]}，已持有 {len(state.held)}"
