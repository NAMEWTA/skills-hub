# 核验独立运行包的结构、调用和分发

本地专项已通过。验证环境为 Windows、Node.js 24.21.0。

| 运行包 | 固定来源与实际采用 | 验证 |
| --- | --- | --- |
| `zh-dashboard-design` | `57f96688862668b482f647fa1e370efb5d3ddd31`。更新 8 份文件，完整安装 1 个入口和 13 份参考。保留 Gold Master Kit、Halo、Shedi 署名链接及用户可取消的条件，运行入口和署名采用 `zh-` 安装名。 | `node --test tests/dashboard-upstream.test.mjs` 通过 3 项。核对结构、示例行为、包内链接、独立安装、重装和领域目录边界。未制作仪表盘或运行 SwiftUI。 |
| `zh-modern-web-guidance` | `2b4aa13a72dd47cd135b06ce5abfccd92e19b24f`。采用 33 个新增或修改文件及 1 项删除，检索参数更新到 `2026_11_16-268fb9ea`。上下文菜单、teaser、passkey、WebMCP 指南保留技术标识和代码流程。 | 在隔离目录独立安装，直接读取入口与上述四份指南，确认删除项和业务目录均未出现。Windows 创建兼容符号链接返回 `EPERM`，安装器报告 `skipped`。未执行网络检索 CLI 或在浏览器里运行指南示例。 |
| `zh-chrome-extensions` | `2b4aa13a72dd47cd135b06ce5abfccd92e19b24f`。与 `64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65` 的 `skills/chrome-extensions/` 所选树相同，运行包字节相同。 | 比较固定树与原有逐文件映射。 |
| `zh-archify` | 运行包保留 `a7ed6fd6657da90414831d1d42cf95987188750c` 的 3.2 版，3.3.2 候选随材料保留。 | `npm run check:upstream` 通过，覆盖独立安装、doctor、中文 locale、validate、deliver、strict check 和真实 browser-check。 |

## Archify 采用决定

`d6b0f71f25a3337ed2fcd09c973cacf67be7baba` 在选定目录新增 411 个路径、删除 16 个路径、修改 100 个路径。候选的 Code Analysis 支持静态依赖与热点、架构漂移、PR 范围比较、绑定源码的证据、外部诊断导入和离线报告。固定 PR 树使用内置 TypeScript SDK，工作树分析的 `auto` 与显式路径可加载项目 SDK。PR 图包生成与远端附件写入使用不同命令。当前 dev 技能只保留可选工具选择，未引入 Code Analysis 依赖、远端写入或新自动化。

继续使用已验证的 3.2 运行版。3.3.2 的本地分析、漂移、PR 联动、依赖加载和浏览器交付尚未完成隔离行为验证，SARIF schema 随附许可还需按对应规范核对实际再分发条件。Code Analysis、Pyright、CodeQL 指纹、Three.js、Vue 夹具、分析模块随附依赖及 Story 解析器的声明已按候选目录原路径保留。旧版本采用依据留在材料子清单。 [候选许可汇总](../../../../../THIRD_PARTY_NOTICES.md#archify) [OASIS SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html)

## 状态图专项

将 pstack 的复合状态入口绘制、CRLF 处理、SANY 诊断和 Windows 进程清理改进移植到 `dev-statechart` 的 Node.js 运行版。Login 夹具的转移先进入复合状态，复合状态内保留到具体叶节点的初始边。Windows 清理器通过管道识别已退出的本轮 worker，POSIX 清理仍面向本轮分离进程组。保留本地指定 Java 与 `TLA2TOOLS`、隔离临时文件和写入成功边界。

- `node scripts/check-statechart-replay.mjs` 通过 33/33 个固定捕获用例。验证 Login 的边与标记，覆盖并行回放、时序属性和不变量反例、记录解析与报告。使用捕获输出及夹具 `view.mjs`，未运行新的 TLC 求解。
- `node --test --test-name-pattern '状态图|SVG 渲染' tests/runtime.test.mjs` 通过 4 项。验证只清理本轮分离进程组、拒绝覆盖已有证据、CRLF 的 UTF-8 SANY 诊断以及单独 SVG 输出。SANY 与 SVG 用例使用合成子进程或渲染器。硬中断后 Windows 子孙进程回收仍缺实测。
- `node scripts/validate-materials.mjs` 在工作区通过，覆盖 15 个项目、2196 个源文件的本地文件集合、哈希、blob、mode 和运行路径。独立包文件映射随采用版本更新。
