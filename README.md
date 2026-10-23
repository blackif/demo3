# demo3 · 星屑档案抽卡模拟器

一个使用 **TypeScript + Vite** 编写的原创角色抽卡模拟器，适合部署到 GitHub Pages。无需后端服务。

## 功能

- 单抽和十连抽
- 原创角色与 SSR / SR / R 稀有度
- 第 50 抽 SSR 保底；十连至少获得一位 SR 或 SSR
- 角色图鉴、召唤记录
- 星晶余额、累计抽数和保底进度
- 使用浏览器 `localStorage` 保存数据
- 响应式布局，支持桌面和手机浏览器

> 本项目为玩法演示。概率与保底规则仅用于本模拟器，不对应任何实际游戏。所有角色均为原创占位设定。

## 本地运行

需要 Node.js 22 或兼容版本。

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址即可体验。

## 构建

```bash
npm run build
npm run preview
```

生产构建输出到 `dist/`。

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。合并到 `main` 后会自动构建并部署。

首次启用时，请到仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。部署成功后，可在 Pages 页面查看实际网址。

Vite 的部署路径已设置为 `/demo3/`，对应仓库名为 `demo3` 的 GitHub Pages 项目站点。

## 存档说明

抽卡记录与图鉴存储在当前浏览器的 `localStorage` 中。清除浏览器站点数据、更换浏览器或设备后，存档不会自动同步。点击“重置模拟数据”会删除本地模拟进度。