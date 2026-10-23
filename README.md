# 人生抽卡模拟器

一个基于 TypeScript + Vite 的纯前端人生模拟游戏，适合通过 GitHub Pages 发布。

## 游戏规则

- 初始寿元为 80 年，年龄从 0 岁开始。
- 单抽推进 1 年并消耗 1 年寿元。
- 十连抽最多推进 10 年；如果人生中途结束，会立即停止。
- 随机人生事件涵盖成长、学习、工作、爱情、家庭、健康、金钱、友情、退休和老年生活。
- 健康、SAN、金钱、人际关系、幸福感和事业会随事件变化。
- 健康低于 20 或 SAN 低于 15 时，每年额外消耗 1 年寿元；健康或寿元归零时人生结束。
- 事件和人生记录保存在当前浏览器的 `localStorage` 中，不需要后端服务。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 发布

仓库配置了 GitHub Actions 工作流，可在 `main` 分支更新后构建并部署到 GitHub Pages。请在仓库 Settings → Pages 中将发布来源设置为 **GitHub Actions**。

> 本项目为虚构的娱乐模拟。事件概率、寿元和状态数值均为游戏设定，不代表真实人生规律。
