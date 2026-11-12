"""在 DSH 主目录之外管理明确请求的开发者身份。

macOS 保存某个 bundle 标识符的辅助功能及屏幕录制授权时，同时保存获授权签名的指定要求。
ad-hoc 签名的要求是代码哈希，因此每个变化构建都会失去授权。证书签名的要求指明
bundle 标识符与证书，因此在变化构建之间保留要求。

身份位于专用钥匙串，密码以仅拥有者可访问权限保存在旁边，因此开发设置可解锁它而无需
系统对话框。以同一用户运行的任何进程都可读取该密码，并签署继承开发授权的代码；
授权仅属于开发 bundle 标识符，绝不属于发布版辅助程序。
"""
import argparse
from contextlib import contextmanager
from dataclasses import dataclass
import fcntl
import json
import os
from pathlib import Path
import re
import secrets
import shlex
import subprocess
import sys
import tempfile

COMMON_NAME = "DSH Computer Use Dev (local)"
OWNER_MARKER = ".dsh-cua-macos-signing"
OWNER_VERSION = "1\n"
SECURITY = "/usr/bin/security"
OPENSSL = "/usr/bin/openssl"
SETUP_COMMAND = "python3 .agents/skills/dsh-cua-macos-signing/scripts/signing_identity.py setup"
REMOVE_COMMAND = "python3 .agents/skills/dsh-cua-macos-signing/scripts/signing_identity.py remove"
CERTIFICATE_CONFIG = f"""[req]
distinguished_name = subject
x509_extensions = extensions
prompt = no
[subject]
CN = {COMMON_NAME}
[extensions]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature
extendedKeyUsage = critical,codeSigning
"""


@dataclass(frozen=True)
class SigningIdentity:
    """已解锁的证书身份，codesign 无需用户交互即可使用。"""
    sha1: str
    keychain: Path


def private_command(command, **kwargs):
    """运行签名工具，不在诊断中暴露秘密参数及其回显输出。"""
    operation = f"{Path(command[0]).name} {command[1]}"
    try:
        return subprocess.run(command, check=True, capture_output=True, text=True, timeout=60, **kwargs).stdout
    except subprocess.CalledProcessError as error:
        raise RuntimeError(f"{operation} failed (exit {error.returncode})") from None
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"{operation} timed out after 60 seconds") from None
    except OSError as error:
        raise RuntimeError(f"{operation} could not run (errno {error.errno})") from None


def security(*args):
    return private_command([SECURITY, *args])


@contextmanager
def identity_lock(directory):
    """跨工作树串行设置与删除；删除身份后，锁 inode 仍保留。"""
    directory.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    with os.fdopen(os.open(directory.parent / f"{directory.name}.lock", os.O_WRONLY | os.O_CREAT, 0o600), "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        yield


def user_keychains():
    """读取 codesign 查找身份时使用的用户钥匙串搜索列表。"""
    return [line.strip().strip('"') for line in security("list-keychains", "-d", "user").splitlines() if line.strip()]


def listed(keychain, keychains):
    """比较规范路径；security 将 /var 报告为 /private/var，并解析其他链接。"""
    return any(os.path.realpath(path) == os.path.realpath(keychain) for path in keychains)


def record_path(directory):
    return directory / "identity.json"


def keychain_path(directory):
    return directory / "signing.keychain-db"


def default_directory():
    """让开发凭证独立于 DSH 配置档、主目录及工作树。"""
    return Path.home() / ".cua-macos-keys" / "dev"


def owned_directory(directory, create=False):
    """修改文件或钥匙串前，拒绝非本工具拥有或内容混杂的目录。"""
    marker = directory / OWNER_MARKER
    if create:
        directory.mkdir(mode=0o700, parents=True, exist_ok=True)
        if not any(directory.iterdir()):
            directory.chmod(0o700)
            with os.fdopen(os.open(marker, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as file:
                file.write(OWNER_VERSION)
    if not directory.exists():
        return
    if marker.is_symlink() or not marker.is_file() or marker.read_bytes() != OWNER_VERSION.encode():
        raise RuntimeError(f"Refusing unowned signing directory: {directory}; choose a new or empty dedicated directory")
    allowed = {OWNER_MARKER, record_path(directory).name, record_path(directory).with_suffix(".tmp").name, keychain_path(directory).name}
    for entry in directory.iterdir():
        # security 创建空的 .flXXXXXXXX 锁，并通过 delete-keychain 删除。
        system_lock = re.fullmatch(r"\.fl[0-9A-Fa-f]{8}", entry.name) and entry.is_file() and entry.stat().st_size == 0
        if (entry.name not in allowed and not system_lock) or entry.is_symlink() or not entry.is_file():
            raise RuntimeError(f"Refusing signing directory with unrelated entries: {directory}; preserve those entries before retrying")


def load(directory):
    """签名前解锁配置的身份。

    尚未执行设置时返回 None。已设置但钥匙串缺失或不再位于搜索列表时抛错，
    否则签名会失败或提示输入密码。
    """
    directory_argument = shlex.quote(str(directory))
    setup_command = f"{SETUP_COMMAND} --directory {directory_argument}"
    remove_command = f"{REMOVE_COMMAND} --directory {directory_argument}"
    record = record_path(directory)
    if not record.exists():
        return None
    try:
        fields = json.loads(record.read_text())
        valid = isinstance(fields, dict) and isinstance(fields.get("password"), str) and isinstance(fields.get("sha1"), str) and bool(fields["password"]) and bool(fields["sha1"])
    except (ValueError, OSError):
        valid = False
    if not valid:
        raise RuntimeError(f"Computer Use development signing record is invalid; run {remove_command}, then {setup_command}")
    keychain = keychain_path(directory)
    if not keychain.is_file():
        raise RuntimeError(f"Computer Use development signing keychain is missing: {keychain}; run {remove_command}, then {setup_command}")
    if not listed(keychain, user_keychains()):
        raise RuntimeError(f"Computer Use development signing keychain is not on the user keychain search list; run {setup_command}")
    # 锁定的钥匙串会使 codesign 显示密码对话框，因此每次都显式解锁。
    security("unlock-keychain", "-p", fields["password"], str(keychain))
    if fields["sha1"] not in security("find-identity", str(keychain)):
        raise RuntimeError(f"Computer Use development signing certificate is missing; run {remove_command}, then {setup_command}")
    return SigningIdentity(sha1=fields["sha1"], keychain=keychain)


def create_certificate(directory, password):
    """在专用钥匙串内创建密钥对，并返回证书 SHA-1。"""
    keychain = keychain_path(directory)
    with tempfile.TemporaryDirectory(prefix=".certificate-", dir=directory) as temporary:
        work = Path(temporary)
        (work / "openssl.cnf").write_text(CERTIFICATE_CONFIG)
        export_password = secrets.token_hex(16)
        for command in (
            ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", "key.pem", "-out", "certificate.pem",
             "-days", "3650", "-config", "openssl.cnf"],
            ["pkcs12", "-export", "-inkey", "key.pem", "-in", "certificate.pem", "-out", "identity.p12",
             "-passout", f"pass:{export_password}"],
        ):
            private_command([OPENSSL, *command], cwd=work)
        fingerprint = private_command([OPENSSL, "x509", "-in", "certificate.pem", "-noout", "-fingerprint", "-sha1"], cwd=work)
        security("create-keychain", "-p", password, str(keychain))
        security("unlock-keychain", "-p", password, str(keychain))
        # 不传参数会禁用不活动超时及睡眠锁定。
        security("set-keychain-settings", str(keychain))
        security("import", str(work / "identity.p12"), "-k", str(keychain), "-P", export_password, "-T", "/usr/bin/codesign")
        # 没有分区列表时，codesign 会询问用户是否允许访问私钥。
        security("set-key-partition-list", "-S", "apple-tool:,apple:", "-s", "-k", password, str(keychain))
    match = re.search(r"=([0-9A-F:]+)", fingerprint)
    if match is None:
        raise RuntimeError("openssl returned no certificate fingerprint")
    sha1 = match.group(1).replace(":", "")
    if sha1 not in security("find-identity", str(keychain)):
        raise RuntimeError("the imported development signing identity is not usable")
    return sha1


def setup(directory):
    """仅在没有记录时创建身份；已记录身份的钥匙串缺失时保留该身份。"""
    with identity_lock(directory):
        return setup_locked(directory)


def setup_locked(directory):
    owned_directory(directory, create=True)
    keychain = keychain_path(directory)
    if record_path(directory).exists():
        if keychain.is_file():
            keychains = user_keychains()
            if not listed(keychain, keychains):
                security("list-keychains", "-d", "user", "-s", *keychains, str(keychain))
        return load(directory)
    clear_identity(directory)
    password = secrets.token_hex(32)
    sha1 = create_certificate(directory, password)
    security("list-keychains", "-d", "user", "-s", *user_keychains(), str(keychain))
    record = record_path(directory)
    with os.fdopen(os.open(record.with_suffix(".tmp"), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "w") as file:
        json.dump({"sha1": sha1, "password": password}, file)
        file.write("\n")
    os.replace(record.with_suffix(".tmp"), record)
    return load(directory)


def remove(directory):
    """删除钥匙串、其搜索列表条目及保存的密码。"""
    with identity_lock(directory):
        remove_locked(directory)


def remove_locked(directory):
    owned_directory(directory)
    clear_identity(directory)
    if directory.exists():
        (directory / OWNER_MARKER).unlink()
        directory.rmdir()


def clear_identity(directory):
    """只删除身份文件及其精确的钥匙串搜索列表条目。"""
    keychain = keychain_path(directory)
    keychains = user_keychains()
    if listed(keychain, keychains):
        security("list-keychains", "-d", "user", "-s", *[path for path in keychains if not listed(keychain, [path])])
    if keychain.exists():
        security("delete-keychain", str(keychain))
    record_path(directory).unlink(missing_ok=True)
    record_path(directory).with_suffix(".tmp").unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description="Manage the local signing identity for source-built Computer Use applications.")
    parser.add_argument("action", choices=["setup", "remove"])
    parser.add_argument("--directory", type=Path, default=default_directory(), help="identity directory; defaults to ~/.cua-macos-keys/dev")
    args = parser.parse_args()
    directory = args.directory.expanduser().resolve()
    if args.action == "setup":
        identity = setup(directory)
        print(json.dumps({"identity": identity.sha1, "keychain": str(identity.keychain)}, indent=2))
    else:
        remove(directory)
        print("Removed the development signing identity; remove its sourceSigning configuration before the next build")


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        print(error, file=sys.stderr)
        sys.exit(1)
