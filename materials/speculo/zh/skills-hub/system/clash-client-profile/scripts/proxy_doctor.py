#!/usr/bin/env python3
"""只读代理诊断。默认离线；需要 Python 3.10+，curl 可选。

本工具不修改代理、DNS、路由、防火墙规则或账号。
回显探测成功不能证明其他应用的流量已被代理。
"""
from __future__ import annotations
import argparse
import ipaddress
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from urllib.parse import urlsplit

PROXY_KEYS = ("http_proxy", "https_proxy", "all_proxy", "no_proxy",
              "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "NO_PROXY")
TARGETS = ("anthropic.com", "claude.ai", "claude.com")
ECHO = {4: "https://api4.ipify.org", 6: "https://api6.ipify.org"}
LIMIT = 1024 * 1024


def local_endpoint(value: str, controller: bool = False) -> str:
    """要求明确的数字回环地址与端口；绝不转发凭据。"""
    try:
        u = urlsplit(value)
        schemes = ("http", "https") if controller else ("http", "https", "socks5h")
        if u.scheme not in schemes or u.username is not None or u.password is not None:
            raise ValueError
        if not u.hostname or not ipaddress.ip_address(u.hostname).is_loopback:
            raise ValueError
        if u.port is None or not 1 <= u.port <= 65535:
            raise ValueError
        if u.path or u.query or u.fragment or any(c.isspace() for c in value):
            raise ValueError
    except (ValueError, TypeError):
        raise ValueError("Use scheme://numeric-loopback:port without credentials, path or query; SOCKS requires socks5h") from None
    return value


def environment_summary(env: dict[str, str]) -> dict:
    result = {}
    for key in PROXY_KEYS:
        value = env.get(key)
        if value is None:
            continue
        if key.lower() == "no_proxy":
            result[key] = {"set": bool(value), "wildcard": any(part.strip() == "*" for part in value.split(",")),
                           "note": "Inspect locally for target-domain bypass; value redacted"}
        else:
            try:
                u = urlsplit(value)
                scheme = u.scheme if u.scheme in ("http", "https", "socks5", "socks5h") else "unknown"
                result[key] = {"set": bool(value), "scheme": scheme,
                               "credentials_present": u.username is not None or u.password is not None}
            except ValueError:
                result[key] = {"set": bool(value), "scheme": "invalid"}
    return result


def target_host(host: object, targets: tuple[str, ...] = TARGETS) -> bool:
    if not isinstance(host, str):
        return False
    host = host.lower().rstrip(".")
    return any(host == t or host.endswith("." + t) for t in targets)


def analyze_connections(data: object, targets: tuple[str, ...] = TARGETS) -> dict:
    if not isinstance(data, dict) or not isinstance(data.get("connections"), list):
        return {"status": "UNVERIFIED", "reason": "Missing connections array", "observations": []}
    observations = []
    for item in data["connections"]:
        if not isinstance(item, dict):
            continue
        metadata = item.get("metadata")
        if not isinstance(metadata, dict) or not target_host(metadata.get("host"), targets):
            continue
        chains = item.get("chains")
        valid = isinstance(chains, list) and bool(chains) and all(isinstance(c, str) for c in chains)
        direct = valid and any(c.upper() == "DIRECT" for c in chains)
        blocked = valid and any(c.upper() in ("REJECT", "REJECT-DROP") for c in chains)
        status = "FAIL" if direct else "BLOCKED" if blocked else "OBSERVED" if valid else "UNVERIFIED"
        observations.append({"status": status, "direct": bool(direct), "blocked": bool(blocked),
                             "chain_length": len(chains) if valid else 0,
                             "rule_present": isinstance(item.get("rule"), str) and bool(item["rule"]),
                             "note": "Host, process, destination IP and node names redacted"})
    return {"status": "FAIL" if any(o["status"] == "FAIL" for o in observations) else "UNVERIFIED",
            "reason": "A snapshot cannot prove all application traffic, DNS, IPv6 or crash isolation",
            "matched_connections": len(observations), "observations": observations}


def curl_command(executable: str, proxy: str, family: int) -> list[str]:
    # -q 必须在首位：忽略 .curlrc（可能含代理、不安全或输出选项）。
    # 不要加入 -6：使用 IPv4 回环 HTTP 代理时，它约束的是代理连接，
    # 而非出口地址族。应改用地址族专用远程端点。
    local_endpoint(proxy)
    return [executable, "-q", "--silent", "--show-error", "--fail",
            "--connect-timeout", "4", "--max-time", "10", "--max-filesize", "128",
            "--proto", "=https", "--proxy", proxy, "--noproxy", "", ECHO[family]]


def probe(proxy: str, family: int, show_ip: bool = False) -> dict:
    executable = shutil.which("curl.exe" if os.name == "nt" else "curl")
    if not executable:
        return {"status": "UNVERIFIED", "reason": "curl unavailable", "family": family}
    env = {k: v for k, v in os.environ.items() if k.lower() not in
           {"http_proxy", "https_proxy", "all_proxy", "no_proxy", "sslkeylogfile"}}
    try:
        result = subprocess.run(curl_command(executable, proxy, family), env=env,
                                capture_output=True, timeout=12, check=False)
        if result.returncode:
            return {"status": "UNVERIFIED", "curl_exit": result.returncode, "family": family,
                    "reason": "Probe failed; no direct retry; this alone does not prove a leak"}
        ip = ipaddress.ip_address(result.stdout.decode("ascii").strip())
        if ip.version != family:
            return {"status": "UNVERIFIED", "reason": "Unexpected echo address family", "family": family}
        return {"status": "OBSERVED", "family": family, "ip": str(ip) if show_ip else "<redacted>",
                "note": "Only this explicit-proxy echo request was observed; country and application route unverified"}
    except (OSError, subprocess.TimeoutExpired, UnicodeError, ValueError):
        return {"status": "UNVERIFIED", "reason": "Probe unavailable or invalid response", "family": family}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, "Redirect refused", headers, fp)


def read_controller(base: str, secret: str | None) -> dict:
    local_endpoint(base, controller=True)
    if secret and any(c in secret for c in "\r\n"):
        raise ValueError("Invalid controller credential")
    headers = {"Authorization": "Bearer " + secret} if secret else {}
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    request = urllib.request.Request(base + "/connections", headers=headers, method="GET")
    with opener.open(request, timeout=5) as response:
        payload = response.read(LIMIT + 1)
    if len(payload) > LIMIT:
        raise ValueError("Controller response too large")
    return json.loads(payload)


def domain(value: str) -> str:
    value = value.lower().rstrip(".")
    labels = value.split(".")
    if len(labels) < 2 or len(value) > 253 or not all(
        label and len(label) <= 63 and label[0].isalnum() and label[-1].isalnum()
        and all(c.isascii() and (c.isalnum() or c == "-") for c in label) for label in labels
    ):
        raise argparse.ArgumentTypeError("Use a DNS hostname, not a URL, wildcard or IP")
    try:
        ipaddress.ip_address(value)
    except ValueError:
        return value
    raise argparse.ArgumentTypeError("Use a DNS hostname, not an IP")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--network", action="store_true", help="Allow explicitly requested network probes; echo services see the exit IP")
    parser.add_argument("--proxy", help="Actual local HTTP/HTTPS or socks5h endpoint; no assumed port")
    parser.add_argument("--controller", help="Existing loopback controller; never enables or reconfigures it")
    parser.add_argument("--connections", type=Path, help="Offline /connections JSON snapshot; keep raw file private")
    parser.add_argument("--target", action="append", type=domain, help="Replace default target domain set; repeat as needed")
    parser.add_argument("--show-ip", action="store_true", help="Include observed public echo IPs in stdout")
    parser.add_argument("--strict", action="store_true", help="Exit 3 for inconclusive evidence; default exits 0 unless DIRECT observed")
    args = parser.parse_args(argv)
    if args.proxy or args.controller:
        if not args.network:
            parser.error("--proxy/--controller require --network; offline inspection makes no requests")
        try:
            if args.proxy:
                local_endpoint(args.proxy)
            if args.controller:
                local_endpoint(args.controller, controller=True)
        except ValueError as exc:
            parser.error(str(exc))
    elif args.network:
        parser.error("--network requires --proxy and/or --controller")
    if args.connections and args.controller:
        parser.error("Choose either an offline snapshot or a live controller")
    report = {"schema_version": 1, "platform": platform.system(), "network_requested": args.network,
              "environment": environment_summary(dict(os.environ)), "verdict": "UNVERIFIED",
              "limitations": ["No OS settings changed", "No direct baseline or fallback",
                              "No DNS/IPv6/crash-isolation or service-region guarantee"]}
    targets = tuple(args.target or TARGETS)
    if args.connections or args.controller:
        try:
            if args.connections:
                with args.connections.open("rb") as handle:
                    payload = handle.read(LIMIT + 1)
                if len(payload) > LIMIT:
                    raise ValueError("Snapshot too large")
                data = json.loads(payload)
            else:
                data = read_controller(args.controller, os.environ.get("MIHOMO_SECRET"))
            report["connections"] = analyze_connections(data, targets)
            if report["connections"]["status"] == "FAIL":
                report["verdict"] = "FAIL"
        except (OSError, ValueError, urllib.error.URLError):
            report["connections"] = {"status": "UNVERIFIED", "reason": "Snapshot/controller unavailable or invalid; raw error withheld"}
    if args.proxy:
        report["echo_probes"] = [probe(args.proxy, family, args.show_ip) for family in (4, 6)]
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if report["verdict"] == "FAIL" else 3 if args.strict else 0


if __name__ == "__main__":
    sys.exit(main())
