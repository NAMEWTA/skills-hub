# 用户需求原文

- 来源：本次用户会话，2026-11-25。
- 适用仓库：https://github.com/NAMEWTA/skills-hub
- 授权：制定方案并实施，commit、push main、release +0.0.1。
- 完整度：以下保留本次用户第 2 项的完整正文；第 1 项 Home 工作由相邻 change 单独跟踪。

## 原文

2、针对 skills/dev/dev-issue-fix skills/dev/dev-issue-setup skills/dev/dev-issue-triage 你认真分析查看，当我需要从远端「不管是github 还是哪里的来源」获取到issue的时候，相关的issue应该其源issue保存到对应的或者新建的change下，source 文件夹里，而不应该是存放到 temp/dev/ 下，不合适。因为类似这种涉及到计划、架构、方案、讨论细节、实施方案等这种文件都应该是放置到对应的change下进行跟踪持久化的。不跟踪持久化的是实施、测试过程中形成的那些过程文件，太多太杂没必要。但是以上的这些文档方案原型，测试后的结论报告等是讲述的change的始末，这些都是十分有必要进行持久化跟踪的。
你认真思考我提出的这个问题，给出详细的解决方案是实施方案，然后实施 commit push main分支 relase+0.0.1
