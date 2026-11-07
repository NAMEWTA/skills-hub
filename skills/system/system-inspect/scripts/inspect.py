#!/usr/bin/env python3
"""Small offline, read-only host snapshot; Python 3.10+, standard library only."""
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
                        help="Existing path on the filesystem to measure (default: current directory).")
    args = parser.parse_args()
    try:
        target = args.path.expanduser().resolve(strict=True)
        disk = shutil.disk_usage(target)
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"Cannot read the requested filesystem: {type(exc).__name__}", file=sys.stderr)
        return 2

    gib = 1024 ** 3
    print("# Read-only system snapshot")
    print()
    print(f"- Observed at: {datetime.now(timezone.utc).isoformat()}")
    print(f"- Platform: {platform.system()} {platform.release()} ({platform.machine()})")
    print(f"- Logical CPUs reported by this process: {os.cpu_count() or 'unknown'}")
    print("- Filesystem: the one containing the selected path; no directory scan")
    print(f"- Total / used / free GiB: {disk.total/gib:.2f} / {disk.used/gib:.2f} / {disk.free/gib:.2f}")
    if hasattr(os, "getloadavg"):
        try:
            values = os.getloadavg()
            print("- Load average (1/5/15 minutes): " + " / ".join(f"{v:.2f}" for v in values))
        except OSError:
            print("- Load average: unavailable")
    print()
    print("This snapshot does not establish the intended host, VM/container quotas,")
    print("performance bottlenecks, disk reclaimability, or successful optimization.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
