# 松林协作 · 成员邀请原型

这里提供成员邀请原型的打开方式与操作路径。完整版本、用户反馈和确认范围统一维护在 [原型走查与确认记录](.agents/dev/changes/2026-11-17-member-invitations/prototype-review.md)。

## 打开入口

[打开成员邀请原型](.agents/dev/changes/2026-11-17-member-invitations/prototype/index.html)

入口是自包含 HTML：下载或在文件管理器中用现代浏览器直接打开 `index.html` 即可，不需要安装依赖或启动服务。全部样式、脚本与虚构数据都在同一文件中，没有网络请求，不发送真实邮件。

固定快照、内容指纹与恢复方法见上述记录的“入口、来源与完整版本”。

## 建议体验顺序

1. 点击 **邀请成员**，输入 `new.member@example.test`，选择 **只读**，发送后观察等待、成功详情与列表新增；关闭抽屉后新邀请仍在。
2. 分别尝试空邮箱、无效格式、已有成员 `lin@example.test`，以及已在待接受列表中的邮箱；错误应保留输入。
3. 在下方 **原型演示** 区把发送结果改为 **下次失败，重试成功**。使用另一个新邮箱发送，查看错误原因，再直接点击 **重试邀请**。
4. 打开邀请的 **查看**，先点击 **撤销邀请 → 保留邀请**，再执行 **撤销邀请 → 确认撤销**，观察列表移除与数量变化。
5. 切换 **普通成员** 检查查看与操作权限；点击 **演示空态**、**演示长邮箱**，检查对应内容。
6. 把浏览器窗口缩窄至约 375–390px，体验抽屉、长邮箱、错误及撤销确认。用 Tab / Shift+Tab 移动焦点、Enter 提交、Escape 关闭；关闭后焦点应回到原入口，入口已消失时回到邀请列表标题。

**重置演示** 恢复初始的管理员身份、正常发送与一条待接受邀请。刷新也会复位。发送或撤销等待期间关闭抽屉，会取消本次模拟请求。

## 验证与反馈记录

[原型走查与确认记录](.agents/dev/changes/2026-11-17-member-invitations/prototype-review.md) 集中保存逐项场景与源码定位、实际执行的检查、浏览器验证限制、用户反馈与明确确认范围，以及生产实施交接。体验后的反馈请对应其中记录的完整资源版本。

## 重跑状态逻辑检查

在项目目录执行：

```bash
node .agents/dev/changes/2026-11-17-member-invitations/verification/logic-check.mjs
```

此脚本使用 Node 的最小显示适配器检查原有状态函数；不启动浏览器、不连接外部服务。历史结果见 [logic-check.txt](.agents/dev/changes/2026-11-17-member-invitations/verification/logic-check.txt)。

已有 [成员页](current/index.html) 与 [需求文档](.agents/dev/changes/2026-11-17-member-invitations/spec.md) 保持原样。概览和设置只保留原导航位置，本次仅开放成员邀请流程。
