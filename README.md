# Who's the Next CEO? · 英伟达 CEO 招聘模拟器（非官方）

USYD Vibe Coding Club 出品的娱乐小游戏。纯前端，无数据库、无大模型调用。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
```

## 部署（GitHub Pages）

线上地址：https://catdisgust.github.io/next-ceo/

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布，约 1 分钟生效。
`vite.config.ts` 使用相对路径 `base: './'`，换仓库名或换到 Vercel 也不用改构建配置，
但要同步修改 `src/config.ts` 里的 `site.siteUrl`（海报二维码指向它）。

## 海报二维码

二维码在浏览器本地生成（`qrcode` 库），内容是 `site.siteUrl?from=qr`。
扫码进入的访问会在 `page_view` 事件里带上 `from=qr`，可以统计海报带来的流量。

## 运营改这里：`src/config.ts`

| 想改什么 | 改哪里 |
|---|---|
| 首页热点文案（热点过去后替换） | `newsHook` |
| 面试题、选项、选项权重 | `questions`（选项 `id` 会进埋点，改文案别改 id） |
| 五种人格的文案 | `personas` |
| 优势 / 短板文案（按最强 / 最弱维度） | `dims` |
| 分数档位、录用结论、身份标签 | `scoreBands` |
| 审核动画台词 | `reviewLines` |
| 挑战文案 | `shareTemplate` |
| 线上网址（会印在海报和挑战文案上） | `site.siteUrl` |
| **社团 CTA 链接（上线前必须填）** | `clubCta.primary.url` / `clubCta.secondary.url` |
| 埋点接口 | `analytics.endpoint` |

CTA 链接留空时：开发环境显示「待配置」提示，生产环境自动隐藏按钮。

## 评分规则

- 5 个维度：技术 / 画饼 / 商业 / 整活创意 / 自信。每个选项给维度加分（每个选项合计 3 分）。
- 各维度按「整套题理论最高分」归一化到 0–100，避免某个维度天然占优。
- 最高维度 → 人格；最低维度 → 致命短板；平分按 `tieBreak` 优先级。
- 虚构评分 = 44 + 最高维度 × 0.36 + 答案组合哈希扰动（0–22），夹在 40–99。同一组答案永远同一结果。
- 全部 1024 种答案组合的人格分布约为 15%–23%，分数范围 58–99。

## 埋点

事件：`page_view` `quiz_start` `question_answer` `quiz_complete` `result_view` `poster_generate` `poster_save` `share_copy` `retry` `club_cta_click`。

- 页面里加载了 Umami 或 Plausible 脚本时自动上报；否则填 `analytics.endpoint` 用 sendBeacon 发 JSON。
- 会话内按 key 去重（每轮答题一个 attemptId），不采集任何个人信息。

## 海报

- 离屏渲染 360×640 节点，`html-to-image` 导出 1080×1920 PNG；结果页出现 1.6 秒后后台预渲染，点按钮基本秒开。
- 手机上优先调起系统分享面板（可「存储图像」），否则下载；小红书 / 微信等内置浏览器只提示「长按图片保存」。
- 渲染失败有重试按钮和「直接截图结果卡」的兜底提示。

## 合规

全站顶部常驻「非官方娱乐模拟器 · 与 NVIDIA 无任何关联」，海报底部印「非官方娱乐模拟结果」，不使用任何官方 Logo，不收集任何个人信息。
