# T04-delegation 验收

状态：真实分层验证进行中。

父 /root 在 Home 直接交给 /root/real_project_a 和 /root/real_project_b；A 已真正派出 provider_implementation，负责人独立58项通过，源码验收提交311addd209ba3de9ce239a32e2f020b009ab8c95。B已派 consumer_impl，等待其实际回执后独立联调。任务/实现/审查证据各留项目 .agents/dev/changes/home-integration，Home仅收管理摘要和指针。所有临时项目在 temp/dev/home-issue-2/real-home/。

原生 Agent 工具是真实执行环境；未将它标为 hc/Claude/Codex CLI运行。容器codex 0.172.0-alpha.2已登录但启动app-server遇只读文件系统，未更改受控HOME或权限、未把失败称为通过。
