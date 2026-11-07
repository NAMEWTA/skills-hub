#!/usr/bin/env python3
"""小型离线只读主机快照；需要 Python 3.10+，只使用标准库。"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import os
from pathlib import Path
import platform
import shutil
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--path", type=Path, default=Path.cwd(),
                        help="目标文件系统上存在的路径，默认当前目录。")
    args = parser.parse_args()
    try:
        target = args.path.expanduser().resolve(strict=True)
        disk = shutil.disk_usage(target)
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"无法读取指定文件系统：{type(exc).__name__}", file=sys.stderr)
        return 2

    gib = 1024 ** 3
    print("# 只读系统快照")
    print()
    print(f"- 观察时间：{datetime.now(timezone.utc).isoformat()}")
    print(f"- 平台：{platform.system()} {platform.release()} ({platform.machine()})")
    print(f"- 当前进程报告的逻辑 CPU 数：{os.cpu_count() or '未知'}")
    print("- 文件系统：所选路径所属文件系统；未扫描目录")
    print(f"- 总量 / 已用 / 可用 GiB：{disk.total/gib:.2f} / {disk.used/gib:.2f} / {disk.free/gib:.2f}")
    if hasattr(os, "getloadavg"):
        try:
            values = os.getloadavg()
            print("- 平均负载（1/5/15 分钟）：" + " / ".join(f"{v:.2f}" for v in values))
        except OSError:
            print("- 平均负载：不可用")
    print()
    print("此快照不证明已定位用户目标主机、虚拟机或容器配额、")
    print("性能瓶颈、可回收空间或优化已经成功。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
