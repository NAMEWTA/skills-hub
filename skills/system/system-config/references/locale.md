# 时区、语言和区域：字段分别处理

先确认用户指定的地点/ID和要改的字段。时区、日期格式、界面语言、键盘、账号国家和 NTP 是不同设置。修改区域不会改变网络出口。

## Windows

在原生 PowerShell 中按需读取：

```powershell
Get-TimeZone
Get-TimeZone -ListAvailable
Get-Culture
Get-WinUserLanguageList
Get-WinSystemLocale
```

Windows 的时区 ID 与 IANA ID 不同，以本机列表核验。用户已指定时区且范围明确后，可用 `Set-TimeZone -Id '本机已核验的 ID'`，随后 `Get-TimeZone` 读回。需要固定时区时检查自动时区机制与管理策略，不盲改注册表。

只改格式用对应当前用户设置，保留语言和输入法。调整语言优先保留已有对象、InputMethodTips 与顺序，不从国家推断键盘。新语言包是安装动作，与选择已安装语言分别处理。

系统 locale 可能需要重启；界面语言可能需要重新登录。不要凭 PowerShell 写入成功宣称所有程序已经切换，也不自动重启或改 Microsoft 账号地区。

## macOS

按需要读取：

```bash
sw_vers
readlink /etc/localtime
defaults read -g AppleLanguages
defaults read -g AppleLocale
```

`systemsetup -gettimezone` / `-listtimezones` 可能需要相应权限。时区修改使用系统支持的界面或已核验的 `systemsetup`，保留自动时区和网络对时的原设置；不手改私有数据库。

语言列表保留用户已有语言；当前用户区域不授权系统登录窗口或所有用户偏好。不要为了设置语言清空输入源、浏览器 profile 或 Apple ID 地区。偏好写入和 GUI 实际生效分别验证。

## Linux / WSL / 容器

读取 `/etc/os-release`、`locale`、`locale -a`；有可用 systemd/DBus 才用 `timedatectl status` 和 `localectl status`。

时区先在 `timedatectl list-timezones` 中验证 IANA ID，再按明确要求用 `timedatectl set-timezone` 并读回。无 systemd 时使用发行版支持的管理方式，权限拒绝不改底层文件绕过。

已有 locale 优先复用，缺少语言包时说明安装范围。LANG、LC_*、LC_ALL 的优先级不同，不为解决一个格式问题写全局 LC_ALL。桌面会话、系统登录和容器 TZ 分开；容器修改不能声称宿主也已改变。

不要更改 RTC 约定、关闭 NTP 或重启显示管理器来完成普通时区调整。

## 恢复与记录

保存本轮字段原值与原先不存在状态。回滚前检查后续用户改动，只恢复本轮。分别报告已保存、已读回、待登录、待重启或尚未验证；不强行重启用户应用。
