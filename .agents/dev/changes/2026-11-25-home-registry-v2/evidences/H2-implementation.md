# H2 登记路由与地图验收

状态：本地通过。

Linux，Node.js 24.22.3，Git 2.56.1。实现 v2 多remote和显式主身份，保留旧v1只读；新保存规范相对路径，local.json保持本机覆盖。save只写登记，map默认stdout、--write显式导出，doctor允许缺地图。

## 实际验证

- `node --test tests/home-registry.test.mjs tests/home-route.test.mjs tests/home-doctor.test.mjs`：作者分组复验11+16+8项通过（包含最后新增insteadOf场景）。
- `node --test tests/home-cli-entry.test.mjs`：7项通过，真实独立安装链接与导入零副作用。
- 主代理先前对Home六组测试运行78项通过；最后只重跑受insteadOf修正影响的route16项，没有把旧输出当作修改后复验。
- 独立审查实际复现并复验跨host/fork重写、GitHub等价重写和展开目标秘密保护，确认原始URL保留、主身份正确。
- 另独立验证多remote闭环、复杂字符目录链接解码、手写地图保护及v1零写入。

没有连接远端Git服务器核实HTTP重定向或SSH服务端映射；Windows/macOS 的实际远端 CI 结果见 [H3](H3-delivery.md)。任务见 [H2](../tasks/H2-implementation.md)。
