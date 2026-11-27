# Archify 原件取得与完整性

固定来源为 `tt-a1i/archify@d6b0f71f25a3337ed2fcd09c973cacf67be7baba` 的 `archify/`，共 601 个 Git 文件。

环境对 shell GitHub 网络访问有限制；GitHub Contents 接口对部分大文件不给出内容，大型 blob 响应也遇到传输限制。本轮没有用截断、空正文或类似版本替代原件。

对大型资源使用同一提交的[官方 Actions 运行](https://github.com/tt-a1i/archify/actions/runs/45737187371)，制品 ID `15079168988`、名称 `website-dist`。外层 zip 的 SHA-256 为 `0d4f4ca68df1076ad8ab7eff35ba53b3dddc59e7556fc5be98e55f82c9f7e2b4`。其中 `.well-known/agent-skills/archify.a608b1be181d14219ccfbbccfbfd1012feb4f2618c14ba4139721ece2cdee478.zip` 的 SHA-256 为文件名中的 `a608b1be181d14219ccfbbccfbfd1012feb4f2618c14ba4139721ece2cdee478`，长度 5,486,838 字节。

该包中 445 个所选来源文件与固定 API Git 树的 blob 完全一致，剩余 156 个通过固定 GitHub API 文件/blob 读取及已确认的空 blob 补齐。只采用选定树内路径；文件最终全部逐一校验，不以“来自制品”替代源码一致性证明。

最大文件 `modules/code-analysis/vendor/typescript.cjs` 为 9,938,268 字节，Git blob 为 `ca5b3942798cf75815c319232b0ba176910423e4`。601 个文件的集合、精确字节和可执行模式均通过[独立固定树核验](all-materials-source-tree-verification.md)。没有执行制品内的程序、CI、hook 或依赖安装。

法律文本与机器资源保留原字节；说明文档完整译写。三篇原本完整中文的 TS 说明仅保留 upstream 原件，相应中文链接按实际稀疏布局调整。代码分析模块尚未进入 `upstream-skills/zh-archify` 运行包，不能宣称该运行包已升级。
