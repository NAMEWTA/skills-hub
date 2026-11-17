> 翻译修改说明：本文由 skills-hub 根据[固定版本原文](https://github.com/tt-a1i/archify/blob/a7ed6fd6657da90414831d1d42cf95987188750c/archify/references/brand-marks.md)翻译并作中文阅读适配。原始可执行代码示例保持不变，原作者归属及适用许可继续保留。

<a id="brand-marks"></a>

# 品牌标识

只有真实产品、提供方、模型系列、渠道或服务身份能够帮助阅读者时，才使用品牌标识。语义 `type` 仍然说明节点做什么；`brand` 说明它是谁的产品。

<a id="agent-decision-path"></a>

## Agent 决策路径

1. 请求点名可识别的品牌时，搜索内置目录：

   ```bash
   node bin/archify.mjs brands "Claude" --json
   ```

2. 将返回的规范 ID 写入节点、参与者或状态：

   ```json
   {
     "id": "planner",
     "type": "backend",
     "label": "Claude",
     "brand": "claude"
   }
   ```

3. 目录没有匹配项，而用户提供了官方网站时，显式抓取其图标：

   ```bash
   node bin/archify.mjs brands capture "https://partner.example.com" --json
   ```

   将命令返回的、由摘要固定的 `brand` 值写入创作节点：

   ```json
   {
     "id": "partner",
     "type": "external",
     "label": "Partner portal",
     "brand": {
       "url": "https://partner.example.com",
       "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
     }
   }
   ```

4. 如果没有匹配项，也没有用户提供的 URL，省略 `brand`。不要编造 URL，也不要悄悄分配一个视觉相似的公司标识。

已知品牌 URL 解析到随包矢量，不访问网络。对于发现的图标 `href` 属性，抓取会在 URL 解析前，将基础命名引用 `amp`、`quot`、`apos`、`lt`、`gt`（及其已定义的大写别名），以及十进制和十六进制数值引用解码一次。因此 `/icon.png?v=1&amp;size=32` 会请求 `/icon.png?v=1&size=32`。URL 的百分号转义保持不变；不会递归解码嵌套转义。此有界解码器不引入通用 HTML 解析器，也不支持全部命名 HTML 实体。

HTML 读取会在注释、原始文本元素和带引号属性之外遇到明确的 head 结束位置时停止，即使这些 token 跨越网络块也一样。256 KiB 的 head 上限和抓取截止时间仍然适用；head 后更大的 body 不会为发现图标而被读取。

图标候选来自注释、原始文本和 template 内容之外的完整 `link` 标签。属性值及 `data-href` 等相似名称不能提供图标声明；带引号的 `>` 字符仍属于各自标签。对于 `text/html`，发现过程将 `noscript` 内容当作原始文本，与启用脚本时的 HTML 解析一致；抓取本身不执行脚本。此排除不适用于 `application/xhtml+xml`，其中 `noscript` 链接仍可被发现。XHTML 中 `<script />` 和 `<template />` 这样的空元素，不会隐藏后续链接；而同样的尾部斜杠在 `text/html` 中不会关闭这些元素。

未知 URL 抓取只接受有界的光栅图像格式，阻止凭据、非标准公共端口、私有地址和链路本地目标，使用有界并发与一个总截止时间，并返回抓取内容的摘要。之后的 render 和 validate 必须匹配该确切摘要；内容被阻止、不可用、发生变化、过大或不安全时，会拒绝继续，而不是悄悄改变产物。

抓取回执、节点元数据以及 SVG／HTML 中的远程品牌溯源，保留源 URL 的 HTTP(S) scheme、主机、端口和路径，但省略 userinfo、查询字符串和 fragment。作者提供的 `brand.url` 和所有下载／重定向 URL 保持不变，以使已有固定引用仍能重现相同字节与摘要。含凭据的下载 URL 仍会被拒绝。内置标识保留其目录中记录的溯源信息。

公开源链接标识原网站／路径，不一定是可下载资源：移除签名查询或依靠查询选择页面的参数后，链接可能不可用，或不再足够具体。有稳定的公开落地页会暴露目标图标时，优先抓取该页面；未经再次抓取和验证，不要修改现有固定引用的 URL。路径会保留，因此这种规范化不是通用的 URL 秘密清理器。

从曾经抓取非活动 HTML 标记（包括 `noscript`）的版本升级后，已有 URL 固定引用可能因发现过程选择了不同图标而报 `brand/digest-mismatch`。检查目标图标，对相同 URL 重新运行上述抓取命令，并明确用返回的固定值替换作者提供的 `brand`。现有固定引用不会自动改写，摘要校验继续强制执行。

对于 ICO 抓取，每个目录条目必须引用一个非空图像范围，该范围位于完整目录之后，并落在下载文件内部。重现固定抓取时也要进行此边界检查。PNG／DIB 载荷、多图像、共享或乱序范围，以及尾随字节仍受支持；该检查不解码像素，也不保证边界合法的载荷一定可解码。某个 ICO 候选被拒绝，不会阻止尝试后续图标。

页面、图标和重定向请求发送 `Accept-Encoding: identity`。抓取不解压响应体：成功响应若声明其他内容编码，会被关闭并明确拒绝。这让既有字节限制和固定摘要都绑定未编码表示。后续可用图标仍可能成功；否则会保留编码错误，不让它被无关的 favicon 404 掩盖。

最终产物打开时绝不获取品牌资源。预设矢量和经过摘要验证的抓取网站图标，始终嵌入 SVG、PNG、WebP、JPEG、Share Card 和 WebM 导出中。

使用 `node bin/archify.mjs brands --json` 检查全部规范 ID、别名、类别、域名和溯源。当前类别覆盖 AI、云、工程、数据、协作、业务系统、渠道、语言和框架。
