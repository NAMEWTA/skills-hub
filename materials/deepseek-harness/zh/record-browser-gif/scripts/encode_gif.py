#!/usr/bin/env python3
"""将 Playwright 视频或有序浏览器截图编码为经过验证的 GIF。"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import NoReturn


DEFAULT_MAX_BYTES = 5 * 1024 * 1024


def fail(message: str) -> NoReturn:
    """以简明、用户可修正的错误退出。"""
    raise SystemExit(f"error: {message}")


def positive_float(value: str) -> float:
    """解析一个有限正数命令行参数。"""
    try:
        parsed = float(value)
    except ValueError:
        fail(f"expected a number, got {value!r}")
    if not math.isfinite(parsed) or parsed <= 0:
        fail(f"expected a positive finite number, got {value!r}")
    return parsed


def positive_int(value: str) -> int:
    """解析一个正整数命令行参数。"""
    try:
        parsed = int(value)
    except ValueError:
        fail(f"expected an integer, got {value!r}")
    if parsed <= 0:
        fail(f"expected a positive integer, got {value!r}")
    return parsed


def nonnegative_float(value: str) -> float:
    """解析有限非负时间戳或停留时长。"""
    try:
        parsed = float(value)
    except ValueError:
        fail(f"expected a number, got {value!r}")
    if not math.isfinite(parsed) or parsed < 0:
        fail(f"expected a nonnegative finite number, got {value!r}")
    return parsed


def parse_durations(value: str, frame_count: int) -> list[float]:
    """展开单个停留时长，或验证每个源帧各自的时长。"""
    parts = [part.strip() for part in value.split(",")]
    if not parts or any(not part for part in parts):
        fail("--durations must be a number or a comma-separated list of numbers")
    durations = [positive_float(part) for part in parts]
    if len(durations) == 1:
        return durations * frame_count
    if len(durations) != frame_count:
        fail(f"--durations supplied {len(durations)} values for {frame_count} frames")
    return durations


def require_binary(name: str) -> str:
    """解析必需媒体可执行文件，或直接失败，不尝试安装。"""
    path = shutil.which(name)
    if path is None:
        fail(f"required binary {name!r} is not available on PATH")
    return path


def run_json(command: list[str]) -> dict[str, object]:
    """运行媒体探测并解析其 JSON 对象。"""
    try:
        completed = subprocess.run(command, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as error:
        detail = error.stderr.strip() or error.stdout.strip() or str(error)
        fail(detail)
    try:
        value = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        fail(f"media probe returned invalid JSON: {error}")
    if not isinstance(value, dict):
        fail("media probe returned a non-object JSON value")
    return value


def probe_stream(ffprobe: str, path: Path) -> dict[str, object]:
    """读取首个视频流的尺寸与时序元数据。"""
    result = run_json(
        [
            ffprobe,
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,nb_frames,duration,r_frame_rate",
            "-of",
            "json",
            str(path),
        ]
    )
    streams = result.get("streams")
    if not isinstance(streams, list) or len(streams) != 1 or not isinstance(streams[0], dict):
        fail(f"expected one video stream in {path}")
    return streams[0]


def video_duration(ffprobe: str, path: Path) -> float:
    """读取容器时长，因为 Playwright WebM 省略流时长。"""
    result = run_json([
        ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path),
    ])
    metadata = result.get("format")
    if not isinstance(metadata, dict):
        fail(f"missing format metadata for {path}")
    return positive_float(str(metadata.get("duration")))


def stream_int(stream: dict[str, object], key: str, path: Path) -> int:
    """读取一个正整数流字段。"""
    try:
        value = int(stream[key])
    except (KeyError, TypeError, ValueError):
        fail(f"missing integer {key!r} in media probe for {path}")
    if value <= 0:
        fail(f"non-positive {key!r} in media probe for {path}")
    return value


def ffconcat_quote(path: Path) -> str:
    """为 ffconcat 路径加引号，同时保留字面反斜杠。"""
    value = str(path)
    if "\n" in value or "\r" in value:
        fail(f"frame path contains a newline: {path}")
    return "'" + value.replace("'", "'\\''") + "'"


def write_concat_manifest(path: Path, frames: list[Path], durations: list[float]) -> None:
    """编写 ffconcat 清单，使最终帧停留实际生效。"""
    lines = ["ffconcat version 1.0"]
    for frame, duration in zip(frames, durations):
        lines.append(f"file {ffconcat_quote(frame)}")
        lines.append(f"duration {duration:.6f}")
    lines.append(f"file {ffconcat_quote(frames[-1])}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def build_parser() -> argparse.ArgumentParser:
    """构建命令行约定。"""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="video file or directory of ordered screenshots")
    parser.add_argument("output", type=Path, help="output .gif path")
    parser.add_argument("--pattern", help="screenshot glob (default: *.png; directory input only)")
    parser.add_argument(
        "--durations",
        help="screenshot holds (default: 2 seconds each; directory input only)",
    )
    parser.add_argument("--start", type=nonnegative_float, help="video trim start in seconds (default: 0)")
    parser.add_argument("--end", type=positive_float, help="video trim end in seconds (default: EOF)")
    parser.add_argument("--speed", type=positive_float, help="video playback multiplier (default: 1)")
    parser.add_argument("--final-hold", type=nonnegative_float, help="extra final video frame hold (default: 2 seconds)")
    parser.add_argument("--fps", type=positive_int, default=10, help="encoded frames per second")
    parser.add_argument(
        "--max-width",
        type=positive_int,
        default=1200,
        help="maximum output width",
    )
    parser.add_argument(
        "--colors",
        type=positive_int,
        default=128,
        help="palette colors, from 4 through 256",
    )
    parser.add_argument(
        "--max-bytes",
        type=positive_int,
        default=DEFAULT_MAX_BYTES,
        help="maximum output size",
    )
    parser.add_argument("--force", action="store_true", help="replace an existing output file")
    return parser


def main() -> None:
    """验证输入、编码 GIF、验证结果并打印 JSON 概要。"""
    args = build_parser().parse_args()
    source = args.input.resolve()
    output = args.output.resolve()

    if not source.exists():
        fail(f"input does not exist: {source}")
    is_video = source.is_file()
    if not is_video and not source.is_dir():
        fail(f"input must be a video file or frame directory: {source}")
    if output.suffix.lower() != ".gif":
        fail(f"output must end in .gif: {output}")
    if output.exists() and not args.force:
        fail(f"output already exists (pass --force to replace it): {output}")
    if not 4 <= args.colors <= 256:
        fail("--colors must be between 4 and 256")
    if args.fps > 30:
        fail("--fps must not exceed 30")

    ffmpeg = require_binary("ffmpeg")
    ffprobe = require_binary("ffprobe")
    details: dict[str, object]
    if is_video:
        if args.pattern is not None or args.durations is not None:
            fail("--pattern and --durations require a screenshot directory")
        if source == output:
            fail("output path must not match the input video")
        probe_stream(ffprobe, source)
        source_duration = video_duration(ffprobe, source)
        start = args.start if args.start is not None else 0.0
        end = args.end if args.end is not None else source_duration
        speed = args.speed if args.speed is not None else 1.0
        final_hold = args.final_hold if args.final_hold is not None else 2.0
        if not start < end <= source_duration:
            fail(f"video trim must satisfy 0 <= start < end <= {source_duration:.3f}")
        if (end - start) / speed < 2 / args.fps:
            fail("video selection must span at least two output frames before the final hold")
        expected_duration = (end - start) / speed + final_hold
        details = {
            "sourceVideo": str(source), "sourceDurationSeconds": source_duration,
            "startSeconds": start, "endSeconds": end, "speed": speed,
            "finalHoldSeconds": final_hold,
        }
    else:
        if any(value is not None for value in (args.start, args.end, args.speed, args.final_hold)):
            fail("--start, --end, --speed and --final-hold require a video file")
        pattern = args.pattern if args.pattern is not None else "*.png"
        if not pattern:
            fail("--pattern must not be empty")
        frames = sorted(path.resolve() for path in source.glob(pattern) if path.is_file())
        if len(frames) < 2:
            fail(f"expected at least two frames in {source}")
        if output in frames:
            fail("output path must not match an input frame")
        durations = parse_durations(args.durations if args.durations is not None else "2", len(frames))
        expected_duration = sum(durations)
        dimensions = {
            (stream_int(stream, "width", frame), stream_int(stream, "height", frame))
            for frame in frames
            for stream in [probe_stream(ffprobe, frame)]
        }
        if len(dimensions) != 1:
            fail(f"all frames must have identical dimensions, got {sorted(dimensions)}")
        details = {"sourceFrames": len(frames)}

    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="record-browser-gif-") as temporary:
        if is_video:
            inputs = ["-i", str(source)]
            timing = f"trim=start={start}:end={end},setpts=(PTS-STARTPTS)/{speed},"
            hold = f",tpad=stop_mode=clone:stop_duration={final_hold}"
        else:
            manifest = Path(temporary) / "frames.ffconcat"
            write_concat_manifest(manifest, frames, durations)
            inputs = ["-f", "concat", "-safe", "0", "-i", str(manifest)]
            timing = ""
            hold = ""
        scale = f"scale='min({args.max_width},iw)':-2:flags=lanczos"
        palette = f"palettegen=max_colors={args.colors}:stats_mode=full"
        filters = (
            f"{timing}fps={args.fps},{scale}{hold},split[base][palette_input];"
            f"[palette_input]{palette}[palette];"
            "[base][palette]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle"
        )
        command = [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            *inputs,
            "-vf",
            filters,
            "-loop",
            "0",
            "-t",
            f"{expected_duration:.6f}",
            "-y" if args.force else "-n",
            str(output),
        ]
        try:
            subprocess.run(command, check=True)
        except subprocess.CalledProcessError as error:
            fail(f"ffmpeg failed with exit code {error.returncode}")

    stream = probe_stream(ffprobe, output)
    width = stream_int(stream, "width", output)
    height = stream_int(stream, "height", output)
    encoded_frames = stream_int(stream, "nb_frames", output)
    try:
        actual_duration = float(stream["duration"])
    except (KeyError, TypeError, ValueError):
        fail(f"missing duration in media probe for {output}")
    tolerance = max(0.2, 2 / args.fps)
    if abs(actual_duration - expected_duration) > tolerance:
        fail(f"expected about {expected_duration:.3f}s, encoded {actual_duration:.3f}s")
    if width > args.max_width:
        fail(f"expected width at most {args.max_width}, encoded {width}")
    if encoded_frames < 2:
        fail(f"expected an animated GIF, encoded {encoded_frames} frame")

    byte_size = output.stat().st_size
    if byte_size > args.max_bytes:
        fail(f"output is {byte_size} bytes, above --max-bytes {args.max_bytes}")

    print(
        json.dumps(
            {
                "output": str(output),
                **details,
                "encodedFrames": encoded_frames,
                "width": width,
                "height": height,
                "durationSeconds": actual_duration,
                "fps": args.fps,
                "bytes": byte_size,
            },
            indent=2,
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
