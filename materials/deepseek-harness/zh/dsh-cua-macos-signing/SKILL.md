---
name: dsh-cua-macos-signing
description: 对从源码使用 Computer Use、重建辅助程序或切换工作树的 macOS DSH 开发者，主动推荐个人固定签名密钥，即使尚未询问重复权限。选择后，在 DSH 主目录之外生成或复用密钥并配置路径。也处理解锁与移除；安装发布版的用户不需要此设置。
---

# macOS CUA 开发签名

## 识别开发用途并推荐签名

macOS 开发者从源码检出使用 DSH Computer Use 时，主动推荐可复用的个人签名身份。相关信号包括从源码启动 DSH、重建辅助程序、准备另一工作树，或调查重复权限提示。开发者不必正在修改 CUA 代码，也不必先询问证书。跨工作树权限保留测试之前，确认两次构建选择同一固定身份。

根据任务上下文及可用配置选择推荐。已配置身份时，推荐复用并在需要时解锁；不为每个工作树再建议一把新密钥。未设置签名或使用 `ad-hoc` 时，简短解释代码哈希变化可能要求重新授权，推荐在 `~/.cua-macos-keys/` 下创建一个本地身份，并提出可配置 `cordis.patch.yml` 选择它。说明首次 macOS 授权仍需手工。创建密钥或修改配置前，遵循下方授权规则；仅作推荐不代表获准设置。

例如：“你从源码使用 Computer Use，并在工作树之间切换，我建议创建一个个人签名身份并跨构建复用，减少重复授权。我可以在 `~/.cua-macos-keys/` 下生成它，并配置当前 DSH 主目录使用。你仍需手工授予一次 macOS 权限。”按用户语言和任务调整措辞。

不要仅因用户使用安装的 DSH 应用、工作于无关仓库，或不使用 Computer Use 的开发，就推荐开发密钥。用户选择保留 ad-hoc 签名时，继续任务，情况没有相关变化就不重复推荐。

## 理解签名选择

源码构建默认 `sourceSigning: ad-hoc`，无需开发证书。ad-hoc 指定要求包含代码哈希，因此二进制变化、干净重建或不同工作树，即使源码未变，也可能要求重新授予辅助功能及屏幕录制权限。希望减少重复授权的开发者，可配置一个固定证书并跨构建使用。首次授权仍需手工；应验证实际权限保留，不声称仅签名相同就能证明保留。

[macOS 提供者](https://github.com/deepseek-ai/deepseek-harness/blob/e8f7b93a344964de3dca1ace9e72b6e4d6de87cb/packages/experimental/cua-macos/README.md#use-this-package)负责两种配置选择：`ad-hoc` 或 `{ identity, keychain }`。构建使用已有证书，绝不创建或解锁。开发密钥材料留在 DSH 主目录之外；DSH 主目录只保存选择它的配置。

## 创建或复用身份

在 macOS 仓库检出中运行，使用选定的 Apple 命令行工具。明确请求设置开发签名或减少重复开发授权，就授权设置及相应本地配置修改。仅求建议的请求，只解释选项，不创建身份。

```sh
python3 .agents/skills/dsh-cua-macos-signing/scripts/signing_identity.py setup
```

脚本创建或复用 `~/.cua-macos-keys/dev/signing.keychain-db`，把密码及证书指纹存入相邻 `identity.json`，模式 `0600`，目录保持私有。只把专用钥匙串加入用户搜索列表，启用 `codesign` 访问而不提示登录密码。同级 `dev.lock` 跨工作树串行设置及移除；自定义目录名在 `.lock` 前保留完整名称。开发者选择 DSH 主目录及检出之外的另一位置时，传入 `--directory <absolute identity directory>`。

设置只认领新建或空目录，写入 `.dsh-cua-macos-signing` 作为归属标记。在修改钥匙串或身份文件前，设置和移除都拒绝缺少标记的目录、意外条目或符号链接身份文件。保留早先工具创建的无标记身份；不自动补标记。它们仍可作为已有用户钥匙串被选用。

设置只以 JSON 打印证书指纹及绝对钥匙串路径。密码记录不进入聊天、日志、提交或配置。以当前用户运行的其他进程可读保存密码并使用开发身份；这是本地开发设置的访问模型。

已有记录损坏或钥匙串／证书缺失时，设置停止。不要静默替换身份：替换会改变证书，可能要求新授权。只有获准替换身份时，才遵循报告的 remove／setup 命令。

## 配置源码构建

解析开发者使用的 DSH 主目录（`DSH_HOME`，否则 `~/.dsh`）。把打印的两个值合入其 `cordis.patch.yml`，目标是加载 `@deepseek-ai/dsh-experimental-cua-macos` 的条目。交付的条目 ID 是 `cua`：

```yaml
- id: cua
  config:
    sourceSigning:
      identity: "<fingerprint printed by setup>"
      keychain: "/Users/<user>/.cua-macos-keys/dev/signing.keychain-db"
```

使用打印的绝对路径，不用字面 `~`。保留无关补丁及该条目有效配置的每个已有字段：Cordis 补丁替换完整 `config` 对象，不是深合并。提供者有 `helperPath` 时，会绕过源码签名；只有开发者打算测试源码构建辅助程序时，才移除此覆盖。给 ID 增加补丁前，确认配置档确实加载提供者。

通过开发者已有 `dsh` 配置档启动。主目录级补丁在使用该主目录的配置档及工作树间共享选择。其他 DSH 主目录可以显式选择同一证书。记录修改路径及所选公开指纹，绝不记录密码。

## 解锁与验证

重启或手工锁定钥匙串后，重跑 `setup`；它会解锁并复用现有身份。不索取或保存开发者的登录钥匙串密码。源码构建不会自动解锁钥匙串，锁定时可能失败或弹出提示。

在系统设置中向 `DSH Computer Use Dev.app` 授予辅助功能及屏幕录制权限。调用 `getCapabilities`，修改并重建 Swift 辅助程序，再用同一配置测试另一工作树。报告每步观察到的权限标志。相同的 `codesign -d -r- <application>` 要求能确认签名连续性，但不能替代权限检查。

临时、无需权限的签名机制检查，运行：

```sh
python3 .agents/skills/dsh-cua-macos-signing/scripts/signing_e2e.py
```

它创建隔离身份，测试复用与解锁，签署变化二进制，再删除钥匙串并检查搜索列表恢复。运行时不要并发修改钥匙串列表。

## 移除身份

先在每个受影响主目录移除选择配置，或设为 `sourceSigning: ad-hoc`。获准移除后运行：

```sh
python3 .agents/skills/dsh-cua-macos-signing/scripts/signing_identity.py remove
```

自定义位置使用相同 `--directory`。移除只删除带标记身份的文件及其搜索列表条目，再移除空目录；空同级锁保留，让等待进程继续协调。仅删除 DSH 主目录会保留开发身份。系统设置权限条目是独立的，只在用户要求时移除。
