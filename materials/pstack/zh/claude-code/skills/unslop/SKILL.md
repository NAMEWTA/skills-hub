---
name: unslop
description: "去除任何文字中的 AI 痕迹。"
disable-model-invocation: true
---

# 清理机械写作

编辑文字，去除 AI 模式。扫描以下模式再重写。保留含义，匹配预期语气。

规则编号是其他技能引用的稳定标识。删除规则后保留编号空缺。

3. 不用不增加事实的尾随“-ing”短语（“highlighting...”“ensuring...”）。
5. 不用含糊归因（“experts believe”）。明确来源，否则删除。
7. 不用 AI 常见套话：additionally、crucial、delve、enhance、foster、landscape、pivotal、showcase、testament、underscore、vibrant。
8. 用“is”或“has”，不用“serves as”“stands as”“boasts”“features”。
9. 不用“not just X, but Y”。直接陈述要点。
10. 不强行将观点凑成三项。
11. 每样事物只有一个名称，重复使用它。
12. 除非 X 和 Y 位于真实的尺度上，否则不用“from X to Y”。
13. 不用长破折号、短破折号或充作破折号的连字符，也不用括号替代它们。改用句号或逗号。
14. 冒号只放在列表或示例前，不在句中用作连接符。
15. 不要将每个专有名词或缩略词都加粗。
16. 不用粗体标签加冒号重复该行内容（“**Performance:** Performance improved...”）。可以使用以句号结尾、增加新信息的粗体引导语。
17. 标题使用句首大写。
18. 不用装饰性表情符号。
19. 使用直引号。
20. 不用聊天机器人套话（“I hope this helps!”“Let me know if...”）。
22. 不以赞美或附和开头。直接回应。
23. 删除填充语。“In order to”改为“to”。删除“it is important to note that”。
24. 最多保留一个保留性用语：“may”。
25. 不用泛泛的结论。陈述具体计划或事实。
26. 不用抽象比喻名词：substrate、wedge、vector、nexus、primitive、harness、surface、scaffolding、paradigm、ratchet、north star、flywheel。使用具体的词。
27. 说明它做什么，而不是感觉如何。点明机制或数字。若一句话原封不动放进其他项目文档也成立，就删掉。
28. 每句话只表达一个意思。读者需要重读的句子应拆开。
29. 使用主动语态。除非行为主体未知或无关紧要，否则点明主体。
30. 删除副词，或换用更有力的动词。给出数字。
31. 使用普通的词：“use”，而非“utilize”或“leverage”。
32. 有字面表达时，不用比喻、格言、拟人化代码或比喻性动词。
33. 使用带有冠词和动词的完整句子。将箭头和缩略语写成完整文字。
